import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { ReportCard } from '@/components/ReportCard';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb';
import { CompanyCard } from '@/components/CompanyCard';
import { HierarchyCard } from '@/components/HierarchyCard';
import { IndicatorCard } from '@/components/IndicatorCard';
import { companies, Company, Superintendence, Management, Project, Indicator } from '@/data/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

type NavigationLevel = 'companies' | 'superintendences' | 'managements' | 'projects' | 'indicators';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedIndicators, setExpandedIndicators] = useState<Set<string>>(new Set());

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
    localStorage.removeItem('neoview_user');
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

  const toggleIndicatorExpanded = (indicatorId: string) => {
    setExpandedIndicators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(indicatorId)) {
        newSet.delete(indicatorId);
      } else {
        newSet.add(indicatorId);
      }
      return newSet;
    });
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
          {/* Breadcrumb */}
          {level !== 'companies' && (
            <div className="mb-4">
              <Breadcrumb
                items={[
                  { label: 'Empresas', onClick: () => resetToLevel('companies') },
                  ...buildBreadcrumbs(),
                ]}
              />
            </div>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Indicators with Expandable Reports */}
          {level === 'indicators' && selectedProject && (
            <div className="space-y-6">
              {selectedProject.indicators.map((indicator) => (
                <div key={indicator.id} className="space-y-4">
                  {/* Indicator Header */}
                  <div 
                    className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:shadow-card-hover transition-all"
                    onClick={() => toggleIndicatorExpanded(indicator.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{indicator.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{indicator.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-2xl font-bold text-primary">{indicator.value} {indicator.unit}</span>
                          <span className={`text-sm font-medium ${
                            indicator.trend === 'up' ? 'text-green-500' :
                            indicator.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                          }`}>
                            {indicator.trend === 'up' ? '↑ Subindo' : 
                             indicator.trend === 'down' ? '↓ Descendo' : '→ Estável'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{indicator.reports.length} relatórios</span>
                        {expandedIndicators.has(indicator.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Reports Grid */}
                  {expandedIndicators.has(indicator.id) && (
                    <div className="pl-6 animate-fade-in">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {indicator.reports.map((report) => (
                          <ReportCard key={report.id} report={report} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Ranking Panel */}
      <RankingPanel
        isOpen={rankingOpen}
        onClose={() => setRankingOpen(false)}
        currentLevel={level}
        selectedCompanyId={selectedCompany?.id}
        selectedSupId={selectedSuperintendence?.id}
        selectedMgmtId={selectedManagement?.id}
        selectedProjId={selectedProject?.id}
      />

      <ChatWidget />
    </div>
  );
};

export default Dashboard;
