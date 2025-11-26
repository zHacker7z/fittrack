import { useState, useEffect } from "react";
import { Plus, Trash2, Apple, UtensilsCrossed, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
  unit: string;
}

interface Meal {
  id: string;
  name: string;
  foods: Food[];
  date: string;
  totalCalories: number;
}

interface FoodTrackerProps {
  username: string;
}

// Banco de dados de alimentos comuns
const foodDatabase: Record<string, { calories: number; protein: number; carbs: number; fats: number; unit: string }> = {
  "arroz branco": { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, unit: "100g" },
  "feijão preto": { calories: 77, protein: 4.5, carbs: 14, fats: 0.5, unit: "100g" },
  "frango grelhado": { calories: 165, protein: 31, carbs: 0, fats: 3.6, unit: "100g" },
  "batata doce": { calories: 86, protein: 1.6, carbs: 20, fats: 0.1, unit: "100g" },
  "ovo cozido": { calories: 155, protein: 13, carbs: 1.1, fats: 11, unit: "unidade" },
  "banana": { calories: 89, protein: 1.1, carbs: 23, fats: 0.3, unit: "unidade" },
  "maçã": { calories: 52, protein: 0.3, carbs: 14, fats: 0.2, unit: "unidade" },
  "peito de peru": { calories: 104, protein: 17.5, carbs: 4, fats: 1.7, unit: "100g" },
  "pão integral": { calories: 247, protein: 13, carbs: 41, fats: 3.5, unit: "100g" },
  "aveia": { calories: 389, protein: 17, carbs: 66, fats: 7, unit: "100g" },
  "leite desnatado": { calories: 34, protein: 3.4, carbs: 5, fats: 0.1, unit: "100ml" },
  "iogurte natural": { calories: 61, protein: 3.5, carbs: 4.7, fats: 3.3, unit: "100g" },
  "queijo minas": { calories: 264, protein: 17.4, carbs: 3.8, fats: 19.2, unit: "100g" },
  "salmão": { calories: 208, protein: 20, carbs: 0, fats: 13, unit: "100g" },
  "brócolis": { calories: 34, protein: 2.8, carbs: 7, fats: 0.4, unit: "100g" },
  "batata inglesa": { calories: 77, protein: 2, carbs: 17, fats: 0.1, unit: "100g" },
  "pasta integral": { calories: 124, protein: 5, carbs: 26, fats: 0.5, unit: "100g" },
  "carne moída": { calories: 332, protein: 14, carbs: 0, fats: 30, unit: "100g" },
  "amendoim": { calories: 567, protein: 26, carbs: 16, fats: 49, unit: "100g" },
  "whey protein": { calories: 120, protein: 24, carbs: 3, fats: 1.5, unit: "30g" },
};

export function FoodTracker({ username }: FoodTrackerProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentMeal, setCurrentMeal] = useState<string>("");
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [mealType, setMealType] = useState<string>("cafe");

  // Carregar refeições do localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem(`fittracker_meals_${username}`);
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals));
    }
  }, [username]);

  // Salvar refeições no localStorage
  const saveMeals = (newMeals: Meal[]) => {
    localStorage.setItem(`fittracker_meals_${username}`, JSON.stringify(newMeals));
    setMeals(newMeals);
  };

  const filteredFoods = Object.keys(foodDatabase).filter((food) =>
    food.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFood = () => {
    if (!selectedFood || !quantity) {
      toast.error("Selecione um alimento e quantidade!");
      return;
    }

    const foodData = foodDatabase[selectedFood];
    const qty = parseFloat(quantity);

    if (qty <= 0) {
      toast.error("Quantidade deve ser maior que zero!");
      return;
    }

    const newFood: Food = {
      id: Date.now().toString(),
      name: selectedFood,
      calories: Math.round(foodData.calories * qty),
      protein: Math.round(foodData.protein * qty * 10) / 10,
      carbs: Math.round(foodData.carbs * qty * 10) / 10,
      fats: Math.round(foodData.fats * qty * 10) / 10,
      quantity: qty,
      unit: foodData.unit,
    };

    setFoods([...foods, newFood]);
    setSelectedFood("");
    setQuantity("1");
    setSearchTerm("");
    toast.success("Alimento adicionado!");
  };

  const removeFood = (id: string) => {
    setFoods(foods.filter((f) => f.id !== id));
    toast.success("Alimento removido!");
  };

  const saveMeal = () => {
    if (!currentMeal.trim()) {
      setCurrentMeal(getMealTypeName(mealType));
    }

    if (foods.length === 0) {
      toast.error("Adicione pelo menos um alimento!");
      return;
    }

    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: currentMeal.trim() || getMealTypeName(mealType),
      foods: [...foods],
      date: new Date().toLocaleString("pt-BR"),
      totalCalories,
    };

    const updatedMeals = [...meals, newMeal];
    saveMeals(updatedMeals);
    setCurrentMeal("");
    setFoods([]);
    toast.success("Refeição salva com sucesso!");
  };

  const deleteMeal = (id: string) => {
    const updatedMeals = meals.filter((m) => m.id !== id);
    saveMeals(updatedMeals);
    toast.success("Refeição excluída!");
  };

  const getMealTypeName = (type: string) => {
    const types: Record<string, string> = {
      cafe: "Café da Manhã",
      almoco: "Almoço",
      lanche: "Lanche",
      jantar: "Jantar",
      ceia: "Ceia",
    };
    return types[type] || "Refeição";
  };

  const getTodayCalories = () => {
    const today = new Date().toLocaleDateString("pt-BR");
    return meals
      .filter((meal) => meal.date.startsWith(today))
      .reduce((sum, meal) => sum + meal.totalCalories, 0);
  };

  const getTodayMacros = () => {
    const today = new Date().toLocaleDateString("pt-BR");
    const todayMeals = meals.filter((meal) => meal.date.startsWith(today));
    
    return todayMeals.reduce(
      (total, meal) => {
        meal.foods.forEach((food) => {
          total.protein += food.protein;
          total.carbs += food.carbs;
          total.fats += food.fats;
        });
        return total;
      },
      { protein: 0, carbs: 0, fats: 0 }
    );
  };

  const mealTypes = {
    cafe: "Café da Manhã",
    almoco: "Almoço",
    lanche: "Lanche",
    jantar: "Jantar",
    ceia: "Ceia",
  };

  const todayMacros = getTodayMacros();

  return (
    <div className="space-y-8">
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur border-purple-500/30">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Calorias Hoje</p>
            <p className="text-3xl text-white">{getTodayCalories()}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-blue-500/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Proteínas</p>
            <p className="text-3xl text-white">{Math.round(todayMacros.protein)}</p>
            <p className="text-xs text-muted-foreground">gramas</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-green-500/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Carboidratos</p>
            <p className="text-3xl text-white">{Math.round(todayMacros.carbs)}</p>
            <p className="text-xs text-muted-foreground">gramas</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-yellow-500/20">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Gorduras</p>
            <p className="text-3xl text-white">{Math.round(todayMacros.fats)}</p>
            <p className="text-xs text-muted-foreground">gramas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Addition Form */}
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Apple className="w-5 h-5 text-purple-400" />
              Adicionar Refeição
            </CardTitle>
            <CardDescription>Registre o que você comeu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meal-type" className="text-white">Tipo de Refeição</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger className="bg-input-background border-purple-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-purple-500/20">
                  {Object.entries(mealTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="meal-name" className="text-white">Nome da Refeição (opcional)</Label>
              <Input
                id="meal-name"
                placeholder={getMealTypeName(mealType)}
                value={currentMeal}
                onChange={(e) => setCurrentMeal(e.target.value)}
                className="bg-input-background border-purple-500/20 text-white"
              />
            </div>

            <div className="h-px bg-purple-500/20"></div>

            <div>
              <Label htmlFor="search-food" className="text-white">Buscar Alimento</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search-food"
                  placeholder="Digite o nome do alimento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-input-background border-purple-500/20 text-white pl-10"
                />
              </div>
            </div>

            {searchTerm && filteredFoods.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1 p-2 bg-secondary/50 rounded-lg border border-purple-500/20">
                {filteredFoods.map((food) => (
                  <button
                    key={food}
                    onClick={() => {
                      setSelectedFood(food);
                      setSearchTerm("");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-purple-500/20 rounded text-white text-sm transition-colors"
                  >
                    {food} ({foodDatabase[food].unit})
                  </button>
                ))}
              </div>
            )}

            {selectedFood && (
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <p className="text-white mb-2">Alimento Selecionado: <span className="text-purple-400">{selectedFood}</span></p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <p>Calorias: {foodDatabase[selectedFood].calories} kcal</p>
                  <p>Proteína: {foodDatabase[selectedFood].protein}g</p>
                  <p>Carboidratos: {foodDatabase[selectedFood].carbs}g</p>
                  <p>Gorduras: {foodDatabase[selectedFood].fats}g</p>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="quantity" className="text-white">
                Quantidade {selectedFood && `(${foodDatabase[selectedFood].unit})`}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-input-background border-purple-500/20 text-white"
                disabled={!selectedFood}
              />
            </div>

            <Button
              onClick={addFood}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!selectedFood}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Alimento
            </Button>
          </CardContent>
        </Card>

        {/* Current Meal Preview */}
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Refeição Atual</CardTitle>
            <CardDescription>
              {currentMeal || getMealTypeName(mealType)} - {foods.length} alimento(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {foods.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum alimento adicionado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-start justify-between p-3 bg-secondary/50 rounded-lg border border-purple-500/20"
                  >
                    <div className="flex-1">
                      <p className="text-white">{food.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {food.quantity} {food.unit} - {food.calories} kcal
                      </p>
                      <p className="text-xs text-gray-400">
                        P: {food.protein}g | C: {food.carbs}g | G: {food.fats}g
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFood(food.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg border border-purple-500/40">
                  <p className="text-white">
                    Total: {foods.reduce((sum, f) => sum + f.calories, 0)} kcal
                  </p>
                </div>

                <Button
                  onClick={saveMeal}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  <Apple className="w-4 h-4 mr-2" />
                  Salvar Refeição
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meal History */}
      {meals.length > 0 && (
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Histórico de Refeições</CardTitle>
            <CardDescription>Suas refeições registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meals.slice().reverse().map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-lg border border-purple-500/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white">{meal.name}</h4>
                      <p className="text-sm text-muted-foreground">{meal.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-purple-500/20 rounded">
                        <p className="text-purple-300">{meal.totalCalories} kcal</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMeal(meal.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {meal.foods.map((food) => (
                      <p key={food.id} className="text-sm text-gray-300">
                        • {food.name} - {food.quantity} {food.unit} ({food.calories} kcal)
                      </p>
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
