import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  CheckSquare,
  Home,
  Star,
  HelpCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Início', path: '/home' },
    { icon: LayoutDashboard, label: 'Meu Workspace', path: '/workspace' },
    { icon: FileText, label: 'Relatórios', path: '/reports' },
    { icon: BarChart3, label: 'Indicadores', path: '/indicators' },
    { icon: CheckSquare, label: 'Aprovações', path: '/approvals' },
    { icon: Star, label: 'Favoritos', path: '/favorites' },
    { icon: HelpCircle, label: 'Ajuda', path: '/help' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

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
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 overflow-hidden',
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    !isOpen && 'lg:justify-center lg:px-3'
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(!isOpen && 'lg:hidden')}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={cn(
            'p-4 border-t border-sidebar-border',
            !isOpen && 'lg:hidden'
          )}>
            <p className="text-xs text-sidebar-foreground/60">
              NeoView v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
