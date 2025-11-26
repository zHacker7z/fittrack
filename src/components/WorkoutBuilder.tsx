import { useState, useEffect } from "react";
import { Plus, Trash2, Dumbbell, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  category: string;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
}

interface WorkoutBuilderProps {
  username: string;
}

export function WorkoutBuilder({ username }: WorkoutBuilderProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [sets, setSets] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [category, setCategory] = useState<string>("peito");

  // Carregar treinos do localStorage
  useEffect(() => {
    const savedWorkouts = localStorage.getItem(`fittracker_workouts_${username}`);
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, [username]);

  // Salvar treinos no localStorage
  const saveWorkouts = (newWorkouts: Workout[]) => {
    localStorage.setItem(`fittracker_workouts_${username}`, JSON.stringify(newWorkouts));
    setWorkouts(newWorkouts);
  };

  const addExercise = () => {
    if (!exerciseName || !sets || !reps) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: parseInt(sets),
      reps: parseInt(reps),
      category,
    };

    setExercises([...exercises, newExercise]);
    setExerciseName("");
    setSets("");
    setReps("");
    toast.success("Exercício adicionado!");
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
    toast.success("Exercício removido!");
  };

  const saveWorkout = () => {
    if (!currentWorkout.trim()) {
      toast.error("Digite um nome para o treino!");
      return;
    }

    if (exercises.length === 0) {
      toast.error("Adicione pelo menos um exercício!");
      return;
    }

    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: currentWorkout,
      exercises: [...exercises],
      date: new Date().toLocaleDateString("pt-BR"),
    };

    const updatedWorkouts = [...workouts, newWorkout];
    saveWorkouts(updatedWorkouts);
    setCurrentWorkout("");
    setExercises([]);
    toast.success("Treino salvo com sucesso!");
  };

  const categories = {
    peito: "Peito",
    costas: "Costas",
    pernas: "Pernas",
    ombros: "Ombros",
    bracos: "Braços",
    abdomen: "Abdômen",
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form to Add Exercises */}
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Dumbbell className="w-5 h-5 text-purple-400" />
              Criar Novo Treino
            </CardTitle>
            <CardDescription>Monte seu treino personalizado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="workout-name" className="text-white">Nome do Treino</Label>
              <Input
                id="workout-name"
                placeholder="Ex: Treino de Peito"
                value={currentWorkout}
                onChange={(e) => setCurrentWorkout(e.target.value)}
                className="bg-input-background border-purple-500/20 text-white"
              />
            </div>

            <div className="h-px bg-purple-500/20"></div>

            <div>
              <Label htmlFor="exercise-name" className="text-white">Exercício</Label>
              <Input
                id="exercise-name"
                placeholder="Ex: Supino Reto"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="bg-input-background border-purple-500/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-white">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input-background border-purple-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-purple-500/20">
                  {Object.entries(categories).map(([key, value]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sets" className="text-white">Séries</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  placeholder="3"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="bg-input-background border-purple-500/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="reps" className="text-white">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  placeholder="12"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="bg-input-background border-purple-500/20 text-white"
                />
              </div>
            </div>

            <Button
              onClick={addExercise}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Exercício
            </Button>
          </CardContent>
        </Card>

        {/* Current Workout Preview */}
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Treino Atual</CardTitle>
            <CardDescription>
              {currentWorkout || "Sem nome"} - {exercises.length} exercício(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exercises.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum exercício adicionado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-purple-500/20"
                  >
                    <div className="flex-1">
                      <p className="text-white">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets}x{exercise.reps} - {categories[exercise.category as keyof typeof categories]}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(exercise.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={saveWorkout}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Treino
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved Workouts */}
      {workouts.length > 0 && (
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Treinos Salvos</CardTitle>
            <CardDescription>Seus treinos personalizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="p-4 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">{workout.date}</p>
                    </div>
                    <div className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">
                      {workout.exercises.length} ex
                    </div>
                  </div>
                  <div className="space-y-2">
                    {workout.exercises.map((ex) => (
                      <div key={ex.id} className="text-sm text-gray-300">
                        • {ex.name} - {ex.sets}x{ex.reps}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
