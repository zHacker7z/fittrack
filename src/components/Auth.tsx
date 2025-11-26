import { useState } from "react";
import { UserPlus, LogIn, Dumbbell, AlertCircle } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

interface AuthProps {
  onLogin: (username: string) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = () => {
    setLoginError("");

    if (!loginUsername || !loginPassword) {
      setLoginError("Preencha todos os campos!");
      toast.error("Preencha todos os campos!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("fittracker_users") || "{}");

    if (!users[loginUsername]) {
      setLoginError("Senha incorreta ou o Usuario não existe!");
      toast.error("Senha incorreta ou o Usuario não existe!");
      return;
    }

    if (users[loginUsername].password !== loginPassword) {
      setLoginError("Senha incorreta ou o Usuario não existe!");
      toast.error("Senha incorreta ou o Usuario não existe!");
      return;
    }

    setLoginError("");
    toast.success("Login realizado com sucesso!");
    onLogin(loginUsername);
  };

  const handleSignup = () => {
    setSignupError("");

    if (
      !signupUsername ||
      !signupEmail ||
      !signupPassword ||
      !signupConfirmPassword
    ) {
      setSignupError("Preencha todos os campos!");
      toast.error("Preencha todos os campos!");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("As senhas não coincidem! Verifique e tente novamente.");
      toast.error("As senhas não coincidem!");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("A senha deve ter pelo menos 6 caracteres!");
      toast.error("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("fittracker_users") || "{}");

    if (users[signupUsername]) {
      setSignupError("Usuário já existe! Escolha outro nome de usuário.");
      toast.error("Usuário já existe!");
      return;
    }

    users[signupUsername] = {
      email: signupEmail,
      password: signupPassword,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("fittracker_users", JSON.stringify(users));

    // Inicializar dados do usuário
    localStorage.setItem(
      `fittracker_workouts_${signupUsername}`,
      JSON.stringify([])
    );
    localStorage.setItem(
      `fittracker_meals_${signupUsername}`,
      JSON.stringify([])
    );

    setSignupError("");
    toast.success("Conta criada com sucesso!");
    onLogin(signupUsername);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl mb-2 text-white">FitTracker</h1>
          <p className="text-gray-400">Seu Sistema Fitness Completo</p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <LogIn className="w-5 h-5 text-purple-400" />
                  Fazer Login
                </CardTitle>
                <CardDescription>Entre com sua conta existente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="login-username" className="text-white">
                    Usuário
                  </Label>
                  <Input
                    id="login-username"
                    placeholder="Digite seu usuário"
                    value={loginUsername}
                    onChange={(e) => {
                      setLoginUsername(e.target.value);
                      setLoginError("");
                    }}
                    className="bg-input-background border-purple-500/20 text-white"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-white">
                    Senha
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError("");
                    }}
                    className="bg-input-background border-purple-500/20 text-white"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>

                {loginError && (
                  <Alert
                    variant="destructive"
                    className="bg-red-500/10 border-red-500/50"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-400">
                      {loginError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                  Criar Conta
                </CardTitle>
                <CardDescription>Crie sua conta gratuitamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="signup-username" className="text-white">
                    Usuário
                  </Label>
                  <Input
                    id="signup-username"
                    placeholder="Escolha um usuário"
                    value={signupUsername}
                    onChange={(e) => {
                      setSignupUsername(e.target.value);
                      setSignupError("");
                    }}
                    className="bg-input-background border-purple-500/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      setSignupError("");
                    }}
                    className="bg-input-background border-purple-500/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-white">
                    Senha
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      setSignupError("");
                    }}
                    className="bg-input-background border-purple-500/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-confirm" className="text-white">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Repita sua senha"
                    value={signupConfirmPassword}
                    onChange={(e) => {
                      setSignupConfirmPassword(e.target.value);
                      setSignupError("");
                    }}
                    className="bg-input-background border-purple-500/20 text-white"
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  />
                </div>

                {signupError && (
                  <Alert
                    variant="destructive"
                    className="bg-red-500/10 border-red-500/50"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-400">
                      {signupError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta
                </Button>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
