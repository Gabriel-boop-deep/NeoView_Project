/**
 * RankingPanel - Top 5 reports ranking
 * Supports embedded mode (inline, no fixed positioning)
 */

import React from 'react';
import { Trophy, Eye, Medal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { companies, getAllReports } from '@/data/mockData';

interface RankingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: 'companies' | 'superintendences' | 'managements' | 'projects' | 'indicators';
  selectedCompanyId?: string;
  selectedSupId?: string;
  selectedMgmtId?: string;
  selectedProjId?: string;
  /** If true, renders inline without fixed positioning */
  embedded?: boolean;
}

export function RankingPanel({
  isOpen,
  onClose,
  currentLevel,
  selectedCompanyId,
  embedded,
}: RankingPanelProps) {
  const getTitle = () => {
    switch (currentLevel) {
      case 'companies':
        return 'Top Relatórios - Todas Empresas';
      case 'superintendences':
        const company = companies.find(c => c.id === selectedCompanyId);
        return `Top Relatórios - ${company?.name || 'Empresa'}`;
      case 'managements':
        return 'Top Relatórios - Superintendência';
      case 'projects':
        return 'Top Relatórios - Gerência';
      case 'indicators':
        return 'Top Relatórios - Projeto';
      default:
        return 'Top Relatórios';
    }
  };

  const getFilteredReports = () => {
    const allReports = getAllReports();
    let filtered = allReports;
    if (selectedCompanyId) {
      filtered = filtered.filter(r => r.companyId === selectedCompanyId);
    }
    return filtered
      .map((r, index) => ({
        ...r,
        views: Math.floor(Math.random() * 500) + (filtered.length - index) * 10,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  };

  const topReports = getFilteredReports();

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0: return <Medal className="w-5 h-5 text-yellow-500" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{position + 1}</span>;
    }
  };

  const getMedalBg = (position: number) => {
    switch (position) {
      case 0: return 'bg-yellow-500/10 border-yellow-500/30';
      case 1: return 'bg-gray-400/10 border-gray-400/30';
      case 2: return 'bg-amber-600/10 border-amber-600/30';
      default: return 'bg-muted/50 border-border';
    }
  };

  if (!isOpen && embedded) return null;

  // Embedded mode - inline card
  if (embedded) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden w-[320px] h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-500 text-white">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold text-sm">Ranking</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-medium text-sm text-foreground">{getTitle()}</h3>
          <p className="text-xs text-muted-foreground mt-1">Relatórios mais acessados</p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {topReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum relatório encontrado</p>
            </div>
          ) : (
            topReports.map((item, index) => (
              <div
                key={item.report.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]',
                  getMedalBg(index)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getMedalIcon(index)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.report.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.path.slice(0, 2).join(' > ')}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.views} visualizações</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Original fixed mode (fallback)
  return (
    <div
      className={cn(
        'fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-card border-l border-border shadow-xl transition-transform duration-300 z-40 overflow-hidden',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          <span className="font-semibold text-sm">Ranking</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-primary-foreground/20 rounded transition-colors">✕</button>
      </div>
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-medium text-sm text-foreground">{getTitle()}</h3>
        <p className="text-xs text-muted-foreground mt-1">Relatórios mais acessados</p>
      </div>
      <div className="overflow-y-auto h-[calc(100%-120px)] p-4 space-y-3">
        {topReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum relatório encontrado</p>
          </div>
        ) : (
          topReports.map((item, index) => (
            <div key={item.report.id} className={cn('p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]', getMedalBg(index))}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getMedalIcon(index)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.report.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.path.slice(0, 2).join(' > ')}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Eye className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.views} visualizações</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RankingPanel;
