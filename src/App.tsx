import { useState, useEffect } from "react";
import {
  Dumbbell,
  Calculator,
  Home,
  UtensilsCrossed,
  LogOut,
  User,
} from "lucide-react";
import { Hero } from "./components/Hero";
import { WorkoutBuilder } from "./components/WorkoutBuilder";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { FoodTracker } from "./components/FoodTracker";
import { Profile } from "./components/Profile";
import { Auth } from "./components/Auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Verificar se há usuário logado ao carregar
  useEffect(() => {
    const loggedUser = localStorage.getItem("fittracker_current_user");
    if (loggedUser) {
      setCurrentUser(loggedUser);
    }
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem("fittracker_current_user", username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fittracker_current_user");
    setCurrentTab("home");
  };

  const getUserProfilePicture = () => {
    // Verifica se currentUser não é null antes de usá-lo
    if (!currentUser) return undefined;

    const users = JSON.parse(localStorage.getItem("fittracker_users") || "{}");
    return users[currentUser]?.profilePicture;
  };

  // Se não há usuário logado, mostrar tela de autenticação
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-white">FitTracker</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab("home")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentTab === "home"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-purple-600/20"
                }`}
              >
                <Home className="w-4 h-4 inline mr-2" />
                Início
              </button>
              <button
                onClick={() => setCurrentTab("workout")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentTab === "workout"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-purple-600/20"
                }`}
              >
                <Dumbbell className="w-4 h-4 inline mr-2" />
                Treinos
              </button>
              <button
                onClick={() => setCurrentTab("food")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentTab === "food"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-purple-600/20"
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 inline mr-2" />
                Refeições
              </button>
              <button
                onClick={() => setCurrentTab("calories")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentTab === "calories"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-purple-600/20"
                }`}
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                Calculadora
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTab("profile")}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={getUserProfilePicture()}
                    alt={currentUser}
                  />
                  <AvatarFallback className="bg-purple-600 text-white text-xs">
                    {currentUser.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm">{currentUser}</span>
              </button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsContent value="home" className="m-0">
            <Hero onGetStarted={() => setCurrentTab("workout")} />
          </TabsContent>

          <TabsContent value="workout" className="m-0">
            <div className="container mx-auto px-4 py-12">
              <div className="mb-8">
                <h1 className="text-4xl mb-2 text-white">Monte Seu Treino</h1>
                <p className="text-gray-400">
                  Crie treinos personalizados e acompanhe seu progresso
                </p>
              </div>
              <WorkoutBuilder username={currentUser} />
            </div>
          </TabsContent>

          <TabsContent value="food" className="m-0">
            <div className="container mx-auto px-4 py-12">
              <div className="mb-8">
                <h1 className="text-4xl mb-2 text-white">
                  Rastreador de Refeições
                </h1>
                <p className="text-gray-400">
                  Registre suas refeições e acompanhe suas calorias diárias
                </p>
              </div>
              <FoodTracker username={currentUser} />
            </div>
          </TabsContent>

          <TabsContent value="calories" className="m-0">
            <div className="container mx-auto px-4 py-12">
              <div className="mb-8">
                <h1 className="text-4xl mb-2 text-white">
                  Calculadora de Calorias
                </h1>
                <p className="text-gray-400">
                  Descubra suas necessidades calóricas e macronutrientes ideais
                </p>
              </div>
              <CalorieCalculator />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="m-0">
            <div className="container mx-auto px-4 py-12">
              <Profile username={currentUser} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-purple-500/20 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-white">FitTracker</span>
          </div>
          <p className="text-gray-400">
            Seu sistema completo de controle de treinos e nutrição
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 FitTracker. Transforme seu corpo, alcance seus objetivos.
          </p>
        </div>
      </footer>
    </div>
  );
}
