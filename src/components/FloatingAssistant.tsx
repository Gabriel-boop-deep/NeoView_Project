/**
 * FloatingAssistant - Coordinated Chat + Ranking floating widget
 * 
 * Bottom-right corner:
 * - Ranking pill + Chat FAB side by side
 * - Ranking panel slides up above ranking pill
 * - Chat window slides up above chat FAB
 * - Both can be open simultaneously, side by side
 */

import React, { useState } from 'react';
import { MessageCircle, X, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Panels row - above the FABs */}
      <div className="flex items-end gap-3 mb-3">
        {/* Ranking Panel */}
        <div className={cn(
          'transition-all duration-300 origin-bottom-right',
          rankingOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-8 pointer-events-none h-0'
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
            : 'opacity-0 scale-95 translate-y-8 pointer-events-none h-0'
        )}>
          <ChatWidget
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            embedded
          />
        </div>
      </div>

      {/* FAB row */}
      <div className="flex items-center justify-end gap-3">
        {/* Ranking pill */}
        <button
          onClick={() => setRankingOpen(!rankingOpen)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 font-medium text-sm',
            rankingOpen
              ? 'bg-gradient-to-r from-yellow-600 to-amber-500 text-white'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          )}
        >
          <Trophy className="w-5 h-5" />
          <span>Ranking</span>
        </button>

        {/* Chat FAB */}
        <Button
          onClick={() => setChatOpen(!chatOpen)}
          size="lg"
          className={cn(
            'rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 bg-gradient-to-br from-primary to-primary/80',
            chatOpen && 'rotate-180'
          )}
        >
          {chatOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

export default FloatingAssistant;
