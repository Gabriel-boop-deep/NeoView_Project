/**
 * PAGE: Home (Início) - Company selection + quick access
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { CompanyCard } from '@/components/CompanyCard';
import { companies } from '@/data/mockData';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('neoview_auth');
    navigate('/');
  };

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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Selecione uma Empresa
          </h1>
          <p className="text-muted-foreground mb-8">
            Acesse rapidamente os relatórios e indicadores da empresa
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                name={company.name}
                fullName={company.fullName}
                onClick={() => navigate(`/dashboard?company=${company.id}`)}
              />
            ))}
          </div>
        </div>
      </main>

      <FloatingAssistant currentLevel="companies" />
    </div>
  );
};

export default Home;
