/**
 * FloatingAssistant - Coordinated Chat + Ranking floating widget
 * 
 * Layout (bottom-right corner):
 * - Default: Ranking pill below Chat FAB
 * - Ranking open (chat closed): Ranking panel slides up, pushing chat FAB up
 * - Chat open (ranking closed): Chat window above FAB
 * - Both open: Chat window + Ranking panel side by side above FABs
 */

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatWidget } from '@/components/Chatbot/ChatWidget';
import { RankingPanel } from '@/components/RankingPanel';

interface FloatingAssistantProps {
  currentLevel: 'companies' | 'superintendences' | 'managements' | 'projects' | 'indicators';
  selectedCompanyId?: string;
  selectedSupId?: string;
  selectedMgmtId?: string;
  selectedProjId?: string;
}

export function FloatingAssistant({
  currentLevel,
  selectedCompanyId,
  selectedSupId,
  selectedMgmtId,
  selectedProjId,
}: FloatingAssistantProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [rankingOpen, setRankingOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panels area - above the FABs */}
      <div className={cn(
        'flex items-end gap-3 transition-all duration-300',
        (!chatOpen && !rankingOpen) && 'pointer-events-none'
      )}>
        {/* Ranking Panel (slides in from right or appears on left of chat) */}
        <div className={cn(
          'transition-all duration-300 origin-bottom-right',
          rankingOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}>
          <RankingPanel
            isOpen={rankingOpen}
            onClose={() => setRankingOpen(false)}
            currentLevel={currentLevel}
            selectedCompanyId={selectedCompanyId}
            selectedSupId={selectedSupId}
            selectedMgmtId={selectedMgmtId}
            selectedProjId={selectedProjId}
            embedded
          />
        </div>

        {/* Chat Window */}
        <div className={cn(
          'transition-all duration-300 origin-bottom-right',
          chatOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}>
          <ChatWidget
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            embedded
          />
        </div>
      </div>

      {/* FAB row */}
      <div className="flex items-center gap-3">
        {/* Ranking pill */}
        <button
          onClick={() => setRankingOpen(!rankingOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 font-medium text-sm',
            rankingOpen
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          )}
        >
          <Trophy className="w-5 h-5" />
          <span>Ranking</span>
        </button>

        {/* Chat FAB - rendered by ChatWidget internally but we need to control it */}
        <ChatWidget
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
          fabOnly
        />
      </div>
    </div>
  );
}

export default FloatingAssistant;
