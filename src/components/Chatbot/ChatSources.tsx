/**
 * ============================================================
 * COMPONENT: ChatSources
 * ============================================================
 * 
 * Exibe as fontes usadas pelo assistente na resposta.
 * Permite navegação direta para indicadores/relatórios.
 * ============================================================
 */

import React from 'react';
import { FileText, BarChart3, FolderOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { SearchSource } from '@/types/backend';

interface ChatSourcesProps {
  sources: SearchSource[];
  className?: string;
}

export function ChatSources({ sources, className }: ChatSourcesProps) {
  const navigate = useNavigate();

  if (!sources || sources.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'indicator':
        return <BarChart3 className="w-3.5 h-3.5" />;
      case 'report':
        return <FileText className="w-3.5 h-3.5" />;
      case 'project':
        return <FolderOpen className="w-3.5 h-3.5" />;
      default:
        return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const handleSourceClick = (source: SearchSource) => {
    // TODO: Implementar navegação baseada no tipo e path
    // Por enquanto, navega para o dashboard
    console.log('Navigating to source:', source);
    navigate('/dashboard');
  };

  return (
    <div className={cn('mt-2 ml-11', className)}>
      <p className="text-xs text-muted-foreground mb-1.5">Fontes:</p>
      <div className="space-y-1">
        {sources.map((source, index) => (
          <button
            key={`${source.id}-${index}`}
            onClick={() => handleSourceClick(source)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group w-full text-left"
          >
            <span className="flex-shrink-0 text-primary">
              {getIcon(source.type)}
            </span>
            <span className="truncate">{source.name}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </button>
        ))}
      </div>

      {/* Path breadcrumb for first source */}
      {sources[0]?.path && sources[0].path.length > 0 && (
        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground/70 overflow-hidden">
          {sources[0].path.slice(0, 3).map((segment, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-muted-foreground/50">/</span>}
              <span className="truncate max-w-[80px]">{segment}</span>
            </React.Fragment>
          ))}
          {sources[0].path.length > 3 && (
            <span className="text-muted-foreground/50">...</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatSources;
