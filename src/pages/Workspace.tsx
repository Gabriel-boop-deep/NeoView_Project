/**
 * ============================================================
 * PAGE: Workspace (Meu Workspace)
 * ============================================================
 * 
 * Dashboard personalizado do usuário com:
 * - Top 5 relatórios mais vistos
 * - Para supervisores: painel de aprovações
 * - Métricas gerais
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatWidget } from '@/components/Chatbot';
import { RankingPanel } from '@/components/RankingPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  FileText, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users,
  TrendingUp,
  Trophy,
  BarChart3,
} from 'lucide-react';
import { getAllReports } from '@/data/mockData';

const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rankingOpen, setRankingOpen] = useState(false);
  const [isSupervisor] = useState(true); // Mock: seria do backend

  const handleLogout = () => {
    localStorage.removeItem('neoview_auth');
    navigate('/');
  };

  // Mock de dados de aprovações (supervisor)
  const approvalStats = {
    approved: 45,
    rejected: 8,
    pending: 12,
    delegated: 5,
  };

  // Top 5 relatórios mais vistos
  const topReports = getAllReports()
    .map((r, i) => ({
      ...r,
      views: Math.floor(Math.random() * 500) + (50 - i) * 10,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Métricas gerais
  const generalStats = {
    totalReports: getAllReports().length,
    totalViews: 12450,
    activeUsers: 234,
    avgViewsPerReport: 156,
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isAuthenticated={true}
        onLogout={handleLogout}
      />

      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} ${rankingOpen ? 'lg:mr-80' : ''}`}>
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-primary" />
                Meu Workspace
              </h1>
              <p className="text-muted-foreground mt-1">
                Visão geral das suas atividades e relatórios
              </p>
            </div>
            <button
              onClick={() => setRankingOpen(!rankingOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              Ranking
            </button>
          </div>

          {/* Métricas Gerais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{generalStats.totalReports}</p>
                    <p className="text-xs text-muted-foreground">Relatórios</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{generalStats.totalViews.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Visualizações</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{generalStats.activeUsers}</p>
                    <p className="text-xs text-muted-foreground">Usuários Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{generalStats.avgViewsPerReport}</p>
                    <p className="text-xs text-muted-foreground">Média/Relatório</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top 5 Relatórios */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Top 5 Relatórios Mais Vistos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topReports.map((item, index) => (
                    <div
                      key={item.report.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && (
                          <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.report.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.path[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Painel do Supervisor */}
            {isSupervisor && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Painel do Supervisor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-foreground">Aprovados</span>
                      </div>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {approvalStats.approved}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-medium text-foreground">Recusados</span>
                      </div>
                      <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {approvalStats.rejected}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-foreground">Pendentes</span>
                      </div>
                      <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                        {approvalStats.pending}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-foreground">Delegados</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {approvalStats.delegated}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/approvals')}
                    className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Ver Todas as Aprovações
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Ranking Panel */}
      <RankingPanel
        isOpen={rankingOpen}
        onClose={() => setRankingOpen(false)}
        currentLevel="companies"
      />

      <ChatWidget />
    </div>
  );
};

export default Workspace;
