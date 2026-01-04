import React from 'react';
import { Home, Building2, FileText, BarChart3, Settings, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: Building2, label: 'Empresas', path: '/dashboard' },
    { icon: FileText, label: 'Relatórios', path: '/dashboard' },
    { icon: BarChart3, label: 'Indicadores', path: '/dashboard' },
    { icon: Settings, label: 'Configurações', path: '/dashboard' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-sidebar z-40 transition-all duration-300 ${
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex justify-end p-2 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`nav-link w-full ${active ? 'active' : ''} ${
                    !isOpen && 'lg:justify-center lg:px-3'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`${!isOpen && 'lg:hidden'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t border-sidebar-border ${!isOpen && 'lg:hidden'}`}>
            <p className="text-xs text-sidebar-foreground/60">
              NeoView v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
