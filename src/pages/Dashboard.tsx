import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb';
import { CompanyCard } from '@/components/CompanyCard';
import { HierarchyCard } from '@/components/HierarchyCard';
import { IndicatorCard } from '@/components/IndicatorCard';
import { companies, Company, Superintendence, Management, Project } from '@/data/mockData';
import { FileUser , HandCoins , Bolt  } from 'lucide-react';

type NavigationLevel = 'companies' | 'superintendences' | 'managements' | 'projects' | 'indicators';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation state
  const [level, setLevel] = useState<NavigationLevel>('companies');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedSuperintendence, setSelectedSuperintendence] = useState<Superintendence | null>(null);
  const [selectedManagement, setSelectedManagement] = useState<Management | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Handle URL params for search navigation
  useEffect(() => {
    const companyId = searchParams.get('company');
    const supId = searchParams.get('sup');
    const mgmtId = searchParams.get('mgmt');
    const projId = searchParams.get('proj');

    if (companyId) {
      const company = companies.find((c) => c.id === companyId);
      if (company) {
        setSelectedCompany(company);
        setLevel('superintendences');

        if (supId) {
          const sup = company.superintendences.find((s) => s.id === supId);
          if (sup) {
            setSelectedSuperintendence(sup);
            setLevel('managements');

            if (mgmtId) {
              const mgmt = sup.managements.find((m) => m.id === mgmtId);
              if (mgmt) {
                setSelectedManagement(mgmt);
                setLevel('projects');

                if (projId) {
                  const proj = mgmt.projects.find((p) => p.id === projId);
                  if (proj) {
                    setSelectedProject(proj);
                    setLevel('indicators');
                  }
                }
              }
            }
          }
        }
      }
    }
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem('neoview_auth');
    navigate('/');
  };

  const resetToLevel = (targetLevel: NavigationLevel) => {
    switch (targetLevel) {
      case 'companies':
        setSelectedCompany(null);
        setSelectedSuperintendence(null);
        setSelectedManagement(null);
        setSelectedProject(null);
        setLevel('companies');
        break;
      case 'superintendences':
        setSelectedSuperintendence(null);
        setSelectedManagement(null);
        setSelectedProject(null);
        setLevel('superintendences');
        break;
      case 'managements':
        setSelectedManagement(null);
        setSelectedProject(null);
        setLevel('managements');
        break;
      case 'projects':
        setSelectedProject(null);
        setLevel('projects');
        break;
    }
  };

  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    if (selectedCompany) {
      items.push({
        label: selectedCompany.name,
        onClick: () => resetToLevel('superintendences'),
      });
    }

    if (selectedSuperintendence) {
      items.push({
        label: selectedSuperintendence.name,
        onClick: () => resetToLevel('managements'),
      });
    }

    if (selectedManagement) {
      items.push({
        label: selectedManagement.name,
        onClick: () => resetToLevel('projects'),
      });
    }

    if (selectedProject) {
      items.push({
        label: selectedProject.name,
      });
    }

    return items;
  };

  const categoryButtons = [
    { icon: FileUser , label: 'Relatórios Corporativos', color: 'border-primary text-primary hover:bg-primary/10' },
    { icon: HandCoins , label: 'Financeiros', color: 'border-secondary text-secondary hover:bg-secondary/10' },
    { icon: Bolt , label: 'Operacionais', color: 'border-accent text-accent hover:bg-accent/10' },
  ];

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
          {/* Breadcrumb */}
          {level !== 'companies' && (
            <Breadcrumb
              items={[
                { label: 'Empresas', onClick: () => resetToLevel('companies') },
                ...buildBreadcrumbs(),
              ]}
            />
          )}

          {/* Page Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
            {level === 'companies' && 'Selecione uma Empresa'}
            {level === 'superintendences' && `${selectedCompany?.name} - Superintendências`}
            {level === 'managements' && `${selectedSuperintendence?.name} - Gerências`}
            {level === 'projects' && `${selectedManagement?.name} - Projetos`}
            {level === 'indicators' && `${selectedProject?.name} - Indicadores`}
          </h1>

          {/* Companies Grid */}
          {level === 'companies' && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {companies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    name={company.name}
                    fullName={company.fullName}
                    onClick={() => {
                      setSelectedCompany(company);
                      setLevel('superintendences');
                    }}
                  />
                ))}
              </div>

              {/* Category Buttons */}
              {/* <div className="flex flex-wrap justify-center gap-4">
                {categoryButtons.map((btn) => {
                  const Icon = btn.icon;
                  return (
                    <button key={btn.label} className={`category-button ${btn.color}`}>
                      <Icon className="w-5 h-5" />
                      {btn.label}
                    </button>
                  );
                })}
              </div> */}
            </>
          )}

          {/* Superintendences Grid */}
          {level === 'superintendences' && selectedCompany && (
            <div className="grid md:grid-cols-2 gap-6">
              {selectedCompany.superintendences.map((sup) => (
                <HierarchyCard
                  key={sup.id}
                  type="superintendence"
                  name={sup.name}
                  count={sup.managements.length}
                  onClick={() => {
                    setSelectedSuperintendence(sup);
                    setLevel('managements');
                  }}
                />
              ))}
            </div>
          )}

          {/* Managements Grid */}
          {level === 'managements' && selectedSuperintendence && (
            <div className="grid md:grid-cols-2 gap-6">
              {selectedSuperintendence.managements.map((mgmt) => (
                <HierarchyCard
                  key={mgmt.id}
                  type="management"
                  name={mgmt.name}
                  count={mgmt.projects.length}
                  onClick={() => {
                    setSelectedManagement(mgmt);
                    setLevel('projects');
                  }}
                />
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {level === 'projects' && selectedManagement && (
            <div className="grid md:grid-cols-2 gap-6">
              {selectedManagement.projects.map((proj) => (
                <HierarchyCard
                  key={proj.id}
                  type="project"
                  name={proj.name}
                  description={proj.description}
                  count={proj.indicators.length}
                  onClick={() => {
                    setSelectedProject(proj);
                    setLevel('indicators');
                  }}
                />
              ))}
            </div>
          )}

          {/* Indicators List */}
          {level === 'indicators' && selectedProject && (
            <div className="space-y-4">
              {selectedProject.indicators.map((indicator) => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
