/**
 * ============================================================
 * PAGE: Indicators
 * ============================================================
 * 
 * Página de visualização de indicadores.
 * Exibe métricas e KPIs das empresas.
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatWidget } from '@/components/Chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Filter,
  ArrowRight,
  FileText
} from 'lucide-react';
import { companies as mockCompanies, Indicator } from '@/data/mockData';

interface IndicatorWithContext extends Indicator {
  companyName: string;
  projectName: string;
  path: string[];
}

const Indicators: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [indicators, setIndicators] = useState<IndicatorWithContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar todos os indicadores
  useEffect(() => {
    const loadIndicators = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const allIndicators: IndicatorWithContext[] = [];

      mockCompanies.forEach(company => {
        company.superintendences.forEach(sup => {
          sup.managements.forEach(mgmt => {
            mgmt.projects.forEach(proj => {
              proj.indicators.forEach(ind => {
                allIndicators.push({
                  ...ind,
                  companyName: company.name,
                  projectName: proj.name,
                  path: [company.name, sup.name, mgmt.name, proj.name],
                });
              });
            });
          });
        });
      });

      setIndicators(allIndicators);
      setIsLoading(false);
    };

    loadIndicators();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('neoview_auth');
    navigate('/');
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredIndicators = indicators.filter(ind =>
    ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ind.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ind.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Agrupar por empresa
  const groupedByCompany = filteredIndicators.reduce((acc, ind) => {
    if (!acc[ind.companyName]) {
      acc[ind.companyName] = [];
    }
    acc[ind.companyName].push(ind);
    return acc;
  }, {} as Record<string, IndicatorWithContext[]>);

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Indicadores</h1>
              <p className="text-muted-foreground mt-1">
                Visualize os KPIs e métricas do grupo
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{indicators.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {indicators.filter(i => i.trend === 'up').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Em alta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {indicators.filter(i => i.trend === 'down').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Em baixa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Minus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {indicators.filter(i => i.trend === 'stable').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Estáveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar indicadores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>

          {/* Indicators by Company */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="h-32 bg-muted rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByCompany).map(([companyName, companyIndicators]) => (
                <Card key={companyName}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{companyName}</CardTitle>
                      <Badge variant="secondary">
                        {companyIndicators.length} indicadores
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {companyIndicators.map(indicator => (
                        <Card 
                          key={indicator.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => navigate('/dashboard')}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-2">
                                  {indicator.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {indicator.projectName}
                                </p>
                              </div>
                              {getTrendIcon(indicator.trend)}
                            </div>
                            <div className="flex items-end justify-between mt-4">
                              <div>
                                <p className={`text-2xl font-bold ${getTrendColor(indicator.trend)}`}>
                                  {indicator.value}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {indicator.unit}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <FileText className="w-3 h-3" />
                                <span>{indicator.reports.length}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredIndicators.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum indicador encontrado</h3>
              <p className="text-muted-foreground">
                Tente uma busca diferente
              </p>
            </div>
          )}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Indicators;
