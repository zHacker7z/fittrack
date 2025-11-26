import { useState, useEffect, useRef } from "react";
import {
  User,
  Camera,
  Save,
  TrendingUp,
  Dumbbell,
  UtensilsCrossed,
  Calendar,
  Target,
  Edit2,
  Palette,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";

interface ProfileData {
  username: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  profilePicture?: string;
  profileColor?: string;
  createdAt: string;
}

interface ProfileProps {
  username: string;
}

export function Profile({ username }: ProfileProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [profileColor, setProfileColor] = useState("purple");
  const personalInfoRef = useRef<HTMLDivElement>(null);

  const colorOptions = [
    {
      value: "purple",
      label: "Roxo",
      gradient: "from-purple-600 to-violet-600",
      border: "border-purple-500",
    },
    {
      value: "blue",
      label: "Azul",
      gradient: "from-blue-600 to-cyan-600",
      border: "border-blue-500",
    },
    {
      value: "green",
      label: "Verde",
      gradient: "from-green-600 to-emerald-600",
      border: "border-green-500",
    },
    {
      value: "red",
      label: "Vermelho",
      gradient: "from-red-600 to-pink-600",
      border: "border-red-500",
    },
    {
      value: "orange",
      label: "Laranja",
      gradient: "from-orange-600 to-yellow-600",
      border: "border-orange-500",
    },
    {
      value: "pink",
      label: "Rosa",
      gradient: "from-pink-600 to-rose-600",
      border: "border-pink-500",
    },
    {
      value: "black",
      label: "Preto",
      gradient: "from-gray-900 to-black",
      border: "border-gray-700",
    },
    {
      value: "white",
      label: "Branco",
      gradient: "from-gray-100 to-white",
      border: "border-gray-300",
    },
  ];

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = () => {
    const users = JSON.parse(localStorage.getItem("fittracker_users") || "{}");
    const userData = users[username];

    if (userData) {
      const profile: ProfileData = {
        username,
        email: userData.email,
        age: userData.age,
        weight: userData.weight,
        height: userData.height,
        goal: userData.goal || "maintain",
        profilePicture: userData.profilePicture,
        profileColor: userData.profileColor,
        createdAt: userData.createdAt,
      };

      setProfileData(profile);
      setAge(userData.age?.toString() || "");
      setWeight(userData.weight?.toString() || "");
      setHeight(userData.height?.toString() || "");
      setGoal(userData.goal || "maintain");
      setProfileColor(userData.profileColor || "purple");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;

      const users = JSON.parse(
        localStorage.getItem("fittracker_users") || "{}"
      );
      users[username].profilePicture = base64String;
      localStorage.setItem("fittracker_users", JSON.stringify(users));

      loadProfile();
      toast.success("Foto de perfil atualizada!");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem("fittracker_users") || "{}");

    if (age) users[username].age = parseInt(age);
    if (weight) users[username].weight = parseFloat(weight);
    if (height) users[username].height = parseFloat(height);
    users[username].goal = goal;
    users[username].profileColor = profileColor;

    localStorage.setItem("fittracker_users", JSON.stringify(users));

    loadProfile();
    setIsEditing(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleColorChange = (color: string) => {
    setProfileColor(color);
    const users = JSON.parse(localStorage.getItem("fittracker_users") || "{}");
    users[username].profileColor = color;
    localStorage.setItem("fittracker_users", JSON.stringify(users));
    toast.success("Cor do banner atualizada!");
  };

  const handleEditProfile = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);

    // Se está ativando o modo de edição, rolar para Informações Pessoais
    if (newEditingState && personalInfoRef.current) {
      // Pequeno delay para garantir que o DOM foi atualizado
      setTimeout(() => {
        personalInfoRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const getStats = () => {
    const workouts = JSON.parse(
      localStorage.getItem(`fittracker_workouts_${username}`) || "[]"
    );
    const meals = JSON.parse(
      localStorage.getItem(`fittracker_meals_${username}`) || "[]"
    );

    const today = new Date().toLocaleDateString("pt-BR");
    const todayMeals = meals.filter((meal: any) => meal.date.startsWith(today));
    const todayCalories = todayMeals.reduce(
      (sum: number, meal: any) => sum + meal.totalCalories,
      0
    );

    return {
      totalWorkouts: workouts.length,
      totalMeals: meals.length,
      todayCalories,
    };
  };

  const getGoalLabel = (goalKey: string) => {
    const goals: Record<string, string> = {
      lose: "Perder Peso",
      maintain: "Manter Peso",
      gain: "Ganhar Peso",
    };
    return goals[goalKey] || "Não definido";
  };

  const getMemberSince = () => {
    if (!profileData?.createdAt) return "";
    const date = new Date(profileData.createdAt);
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "long" });
  };

  if (!profileData) return null;

  const stats = getStats();
  const currentColor =
    colorOptions.find((c) => c.value === profileColor) || colorOptions[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-linear-to-br from-purple-900/40 to-violet-900/40 backdrop-blur border-purple-500/30 overflow-hidden">
        <div
          className={`h-32 bg-linear-to-r ${currentColor.gradient} relative`}
        >
          {/* Color Picker Button */}
          <div className="absolute top-3 right-3 md:top-4 md:right-4">
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-2 md:p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-lg transition-all border border-white/20 hover:border-white/40">
                  <Palette className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 md:w-96 bg-gray-900/95 backdrop-blur-xl border-purple-500/30 p-4">
                <div className="space-y-3">
                  <h3 className="text-white mb-3">Escolha a cor do banner</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorChange(color.value)}
                        className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          profileColor === color.value
                            ? `${color.border} ring-2 ring-offset-2 ring-offset-gray-900`
                            : "border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <div
                          className={`w-full h-12 rounded-md bg-gradient-to-r ${color.gradient} mb-2`}
                        ></div>
                        <p
                          className={`text-sm text-center ${
                            profileColor === color.value
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {color.label}
                        </p>
                        {profileColor === color.value && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <CardContent className="relative pt-0 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-12">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src={profileData.profilePicture} alt={username} />
                <AvatarFallback className="bg-purple-600 text-white text-3xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile-picture"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl text-white mb-1">{username}</h1>
              <p className="text-gray-400 mb-2">{profileData.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                  <span className="text-purple-300 text-sm">
                    <Target className="w-3 h-3 inline mr-1" />
                    {getGoalLabel(profileData.goal || "maintain")}
                  </span>
                </div>
                <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                  <span className="text-purple-300 text-sm">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Membro desde {getMemberSince()}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={handleEditProfile}
              variant={isEditing ? "secondary" : "default"}
              className={
                isEditing
                  ? ""
                  : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              }
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 backdrop-blur border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Dumbbell className="w-8 h-8 text-blue-400" />
              <div className="text-right">
                <p className="text-3xl text-white">{stats.totalWorkouts}</p>
                <p className="text-sm text-gray-400">Treinos Realizados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 backdrop-blur border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <UtensilsCrossed className="w-8 h-8 text-green-400" />
              <div className="text-right">
                <p className="text-3xl text-white">{stats.totalMeals}</p>
                <p className="text-sm text-gray-400">Refeições Registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 backdrop-blur border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <div className="text-right">
                <p className="text-3xl text-white">{stats.todayCalories}</p>
                <p className="text-sm text-gray-400">Calorias Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div ref={personalInfoRef}>
          <Card className="bg-card/50 backdrop-blur border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-purple-400" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                {isEditing ? "Edite suas informações" : "Seus dados pessoais"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="age" className="text-white">
                      Idade
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      placeholder="Ex: 25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-input-background border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-white">
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      min="1"
                      step="0.1"
                      placeholder="Ex: 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-input-background border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-white">
                      Altura (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="1"
                      placeholder="Ex: 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-input-background border-purple-500/20 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-purple-500/20">
                    <span className="text-gray-400">Idade</span>
                    <span className="text-white">
                      {profileData.age
                        ? `${profileData.age} anos`
                        : "Não informado"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-purple-500/20">
                    <span className="text-gray-400">Peso</span>
                    <span className="text-white">
                      {profileData.weight
                        ? `${profileData.weight} kg`
                        : "Não informado"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg border border-purple-500/20">
                    <span className="text-gray-400">Altura</span>
                    <span className="text-white">
                      {profileData.height
                        ? `${profileData.height} cm`
                        : "Não informado"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Goals & Preferences */}
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-purple-400" />
              Objetivo
            </CardTitle>
            <CardDescription>
              {isEditing ? "Defina seu objetivo" : "Seu objetivo atual"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div>
                <Label htmlFor="goal" className="text-white">
                  Objetivo Principal
                </Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger className="bg-input-background border-purple-500/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-purple-500/20">
                    <SelectItem value="lose" className="text-white">
                      Perder Peso
                    </SelectItem>
                    <SelectItem value="maintain" className="text-white">
                      Manter Peso
                    </SelectItem>
                    <SelectItem value="gain" className="text-white">
                      Ganhar Peso
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-lg border border-purple-500/40">
                <Target className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl text-white mb-2">
                  {getGoalLabel(profileData.goal || "maintain")}
                </h3>
                <p className="text-gray-400 text-sm">
                  {profileData.goal === "lose" &&
                    "Foco em déficit calórico e exercícios aeróbicos"}
                  {profileData.goal === "maintain" &&
                    "Manutenção do peso atual com dieta balanceada"}
                  {profileData.goal === "gain" &&
                    "Superávit calórico e treino de força"}
                  {!profileData.goal &&
                    "Defina seu objetivo para receber dicas personalizadas"}
                </p>
              </div>
            )}

            {!isEditing && (
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h4 className="text-white mb-2">💡 Dica Personalizada</h4>
                <p className="text-sm text-gray-300">
                  {profileData.goal === "lose" &&
                    "Mantenha um déficit de 300-500 calorias por dia e inclua treinos aeróbicos 3-4x por semana."}
                  {profileData.goal === "maintain" &&
                    "Equilibre suas calorias consumidas com as gastas. Mantenha uma rotina consistente de exercícios."}
                  {profileData.goal === "gain" &&
                    "Consuma 300-500 calorias acima da sua necessidade diária e foque em treinos de força."}
                  {!profileData.goal &&
                    "Complete seu perfil para receber dicas personalizadas!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/50 backdrop-blur border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Progresso e Conquistas</CardTitle>
          <CardDescription>Acompanhe sua jornada fitness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white">Treinos Esta Semana</p>
                  <p className="text-sm text-gray-400">Continue assim!</p>
                </div>
              </div>
              <div className="w-full bg-secondary/50 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-violet-600 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white">Meta Calórica</p>
                  <p className="text-sm text-gray-400">
                    Você está no caminho certo!
                  </p>
                </div>
              </div>
              <div className="w-full bg-secondary/50 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
