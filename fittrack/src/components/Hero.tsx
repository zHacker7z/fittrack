import { Dumbbell, TrendingUp, Zap, ChevronRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="font-Righteous text-7xl md:text-9xl mb-4 bg-gradient-to-r from-white via-purple-200 to-violet-400 bg-clip-text text-transparent tracking-wider leading-none animate-pulse">
            Fit Tracker
          </h1>
          <h2 className="text-2xl md:text-4xl mb-8 text-purple-300 font-semibold tracking-wide">
            Controle Total dos Seus Treinos e Nutrição
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
            Monte treinos personalizados, registre suas refeições, calcule suas
            calorias e acompanhe seu progresso em uma plataforma completa e
            intuitiva.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer transform hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Dumbbell className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white mb-2 font-semibold text-lg">
                Monte Treinos
              </h3>
              <p className="text-gray-400 text-sm">
                Crie treinos personalizados com exercícios e séries customizadas
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer transform hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white mb-2 font-semibold text-lg">
                Rastreie Nutrição
              </h3>
              <p className="text-gray-400 text-sm">
                Registre refeições e calcule calorias automaticamente
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-900/40 to-violet-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer transform hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white mb-2 font-semibold text-lg">
                Acompanhe Progresso
              </h3>
              <p className="text-gray-400 text-sm">
                Visualize estatísticas e alcance seus objetivos
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 transform hover:scale-105 flex items-center gap-2"
            >
              Começar Treinos
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
    </div>
  );
}
