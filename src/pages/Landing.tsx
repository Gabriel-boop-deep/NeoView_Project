import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NeoLogo } from '@/components/NeoLogo';
import { Building2, FileText, Search, ArrowRight, Shield, BarChart3 } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Building2,
      title: 'Estrutura Organizacional',
      description: 'Navegue pela hierarquia corporativa de forma intuitiva.',
    },
    {
      icon: FileText,
      title: 'Relatórios Centralizados',
      description: 'Acesse todos os relatórios PDF em um único lugar.',
    },
    {
      icon: Search,
      title: 'Busca Global',
      description: 'Encontre indicadores e relatórios rapidamente.',
    },
    {
      icon: BarChart3,
      title: 'Indicadores',
      description: 'Visualize métricas e KPIs de forma clara.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <NeoLogo size="lg" />
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Plataforma Corporativa
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Relatórios Corporativos
            <br />
            <span className="text-gradient">em um só lugar</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            NeoView é a plataforma centralizada para acesso a indicadores e relatórios 
            das empresas do grupo Neoenergia.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 hero-gradient text-primary-foreground rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            Acessar Plataforma
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-foreground mb-12">
            Tudo que você precisa para acessar informações corporativas
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card p-6 rounded-xl shadow-card border border-border"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 NeoView - Plataforma de Relatórios Corporativos</p>
          <p className="mt-1">Grupo Neoenergia</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
