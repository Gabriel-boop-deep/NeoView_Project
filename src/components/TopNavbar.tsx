import React from 'react';
import { Menu, Home, Star, HelpCircle, LogOut } from 'lucide-react';
import { NeoLogo } from './NeoLogo';
import { GlobalSearch } from './GlobalSearch';
import { useNavigate } from 'react-router-dom';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleSidebar,
  isAuthenticated,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 h-16 bg-card border-b border-border shadow-navbar">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          )}
          <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
            <NeoLogo size="md" />
          </button>
        </div>

        {isAuthenticated && (
          <div className="flex-1 flex justify-center px-4">
            <GlobalSearch />
          </div>
        )}

        <nav className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Início</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Favoritos</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground">
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Ajuda</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-sm text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Entrar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
