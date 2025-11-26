import { useState } from "react";
import { Calculator, Activity, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";

export function CalorieCalculator() {
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [results, setResults] = useState<{
    bmr: number;
    tdee: number;
    goalCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);

  const activityLevels = {
    sedentary: { label: "Sedentário (pouco ou nenhum exercício)", multiplier: 1.2 },
    light: { label: "Levemente ativo (1-3 dias/semana)", multiplier: 1.375 },
    moderate: { label: "Moderadamente ativo (3-5 dias/semana)", multiplier: 1.55 },
    active: { label: "Muito ativo (6-7 dias/semana)", multiplier: 1.725 },
    veryActive: { label: "Extremamente ativo (2x por dia)", multiplier: 1.9 },
  };

  const goals = {
    lose: { label: "Perder peso (déficit de 500 kcal)", adjustment: -500 },
    maintain: { label: "Manter peso", adjustment: 0 },
    gain: { label: "Ganhar peso (superávit de 500 kcal)", adjustment: 500 },
  };

  const calculateCalories = () => {
    if (!age || !weight || !height) {
      toast.error("Preencha todos os campos!");
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    // Calculando BMR usando a fórmula de Mifflin-St Jeor
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Calculando TDEE (Total Daily Energy Expenditure)
    const activityMultiplier = activityLevels[activityLevel as keyof typeof activityLevels].multiplier;
    const tdee = bmr * activityMultiplier;

    // Ajustando para o objetivo
    const goalAdjustment = goals[goal as keyof typeof goals].adjustment;
    const goalCalories = tdee + goalAdjustment;

    // Calculando macros (usando distribuição padrão: 30% proteína, 40% carboidratos, 30% gorduras)
    const protein = (goalCalories * 0.3) / 4; // 4 calorias por grama de proteína
    const carbs = (goalCalories * 0.4) / 4; // 4 calorias por grama de carboidrato
    const fats = (goalCalories * 0.3) / 9; // 9 calorias por grama de gordura

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goalCalories: Math.round(goalCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    });

    toast.success("Cálculo realizado com sucesso!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculator Form */}
      <Card className="bg-card/50 backdrop-blur border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="w-5 h-5 text-purple-400" />
            Calculadora de Calorias
          </CardTitle>
          <CardDescription>
            Calcule suas necessidades calóricas diárias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gender */}
          <div className="space-y-3">
            <Label className="text-white">Sexo</Label>
            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="border-purple-500/50" />
                <Label htmlFor="male" className="text-white cursor-pointer">Masculino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="border-purple-500/50" />
                <Label htmlFor="female" className="text-white cursor-pointer">Feminino</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Age, Weight, Height */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="age" className="text-white">Idade</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-input-background border-purple-500/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-white">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-input-background border-purple-500/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-white">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-input-background border-purple-500/20 text-white"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <Label htmlFor="activity" className="text-white">Nível de Atividade</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger className="bg-input-background border-purple-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-purple-500/20">
                {Object.entries(activityLevels).map(([key, { label }]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goal */}
          <div>
            <Label htmlFor="goal" className="text-white">Objetivo</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger className="bg-input-background border-purple-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-purple-500/20">
                {Object.entries(goals).map(([key, { label }]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={calculateCalories}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calcular
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        {results ? (
          <>
            <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  Seus Resultados
                </CardTitle>
                <CardDescription>Baseado nas suas informações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-muted-foreground mb-1">BMR</p>
                    <p className="text-2xl text-white">{results.bmr}</p>
                    <p className="text-xs text-muted-foreground">kcal/dia</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-muted-foreground mb-1">TDEE</p>
                    <p className="text-2xl text-white">{results.tdee}</p>
                    <p className="text-xs text-muted-foreground">kcal/dia</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg border border-purple-500/40">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <p className="text-white">Meta Calórica Diária</p>
                  </div>
                  <p className="text-4xl text-white">{results.goalCalories}</p>
                  <p className="text-sm text-muted-foreground">kcal/dia</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Distribuição de Macronutrientes
                </CardTitle>
                <CardDescription>Recomendação diária</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Protein */}
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white">Proteínas</span>
                      <span className="text-white">{results.protein}g</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">30% das calorias</p>
                  </div>

                  {/* Carbs */}
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white">Carboidratos</span>
                      <span className="text-white">{results.carbs}g</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">40% das calorias</p>
                  </div>

                  {/* Fats */}
                  <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg border border-yellow-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white">Gorduras</span>
                      <span className="text-white">{results.fats}g</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">30% das calorias</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-gray-300">
                    💡 <span className="text-white">Dica:</span> Esta é uma distribuição padrão. Ajuste conforme suas necessidades e preferências pessoais.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-card/50 backdrop-blur border-purple-500/20">
            <CardContent className="py-20">
              <div className="text-center text-muted-foreground">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Preencha o formulário para calcular suas necessidades calóricas</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
