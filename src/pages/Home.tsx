/**
 * ============================================================
 * PAGE: Home (Início)
 * ============================================================
 * 
 * Página inicial após login com acesso rápido e resumo.
 * ============================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatWidget } from '@/components/Chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home as HomeIcon, 
  Building2, 
  FileText, 
  BarChart3, 
  Settings,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { companies, getAllReports } from '@/data/mockData';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('neoview_auth');
    navigate('/');
  };

  const quickLinks = [
    { icon: Building2, label: 'Explorar Empresas', path: '/dashboard', color: 'bg-primary/10 text-primary' },
    { icon: FileText, label: 'Ver Relatórios', path: '/reports', color: 'bg-secondary/10 text-secondary' },
    { icon: BarChart3, label: 'Indicadores', path: '/indicators', color: 'bg-accent/10 text-accent' },
    { icon: Settings, label: 'Configurações', path: '/settings', color: 'bg-muted text-muted-foreground' },
  ];

  // Últimos relatórios (mock)
  const recentReports = getAllReports().slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isAuthenticated={true}
        onLogout={handleLogout}
      />

      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="container mx-auto px-6 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <HomeIcon className="w-8 h-8 text-primary" />
              Bem-vindo ao NeoView
            </h1>
            <p className="text-muted-foreground mt-1">
              Acesse rapidamente os principais recursos da plataforma
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card
                  key={link.path}
                  className="cursor-pointer hover:shadow-card-hover transition-all group"
                  onClick={() => navigate(link.path)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-xl ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-medium text-foreground">{link.label}</span>
                    <ArrowRight className="w-4 h-4 mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Resumo Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Resumo Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">{companies.length}</p>
                    <p className="text-sm text-muted-foreground">Empresas</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-foreground">{getAllReports().length}</p>
                    <p className="text-sm text-muted-foreground">Relatórios</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Relatórios Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  Relatórios Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((item) => (
                    <div
                      key={item.report.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-destructive flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.report.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.report.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Home;
