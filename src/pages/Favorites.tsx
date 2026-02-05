/**
 * ============================================================
 * PAGE: Favorites (Favoritos)
 * ============================================================
 * 
 * Página de relatórios e indicadores favoritos do usuário.
 * ============================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatWidget } from '@/components/Chatbot';
import { Card, CardContent } from '@/components/ui/card';
import { ReportCard } from '@/components/ReportCard';
import { 
  Star, 
  FileText,
  BarChart3,
  Search,
  Filter,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAllReports } from '@/data/mockData';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'reports' | 'indicators'>('reports');

  const handleLogout = () => {
    localStorage.removeItem('neoview_auth');
    navigate('/');
  };

  // Mock de favoritos (em produção viria do banco)
  const favoriteReports = getAllReports().slice(0, 6);

  const filteredReports = favoriteReports.filter(r =>
    r.report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              Favoritos
            </h1>
            <p className="text-muted-foreground mt-1">
              Seus relatórios e indicadores salvos
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4" />
              Relatórios
            </button>
            <button
              onClick={() => setActiveTab('indicators')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'indicators'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Indicadores
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar nos favoritos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Content */}
          {activeTab === 'reports' && (
            <>
              {filteredReports.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum favorito encontrado</h3>
                    <p className="text-muted-foreground">
                      Adicione relatórios aos favoritos para acesso rápido
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports.map((item) => (
                    <ReportCard key={item.report.id} report={item.report} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'indicators' && (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum indicador favoritado</h3>
                <p className="text-muted-foreground">
                  Navegue pelos indicadores e adicione aos favoritos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Favorites;
