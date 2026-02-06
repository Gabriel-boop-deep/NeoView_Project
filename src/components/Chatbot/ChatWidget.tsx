/**
 * ChatWidget - IRÍS
 * Supports two modes:
 * - Standalone (default): manages own open/close state with FAB
 * - Embedded: controlled by parent via props, no FAB rendered
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatMessage } from './ChatMessage';
import { ChatSources } from './ChatSources';

interface ChatWidgetProps {
  className?: string;
  /** Controlled open state (embedded mode) */
  isOpen?: boolean;
  /** Called when user closes the window (embedded mode) */
  onClose?: () => void;
  /** Called when FAB is clicked (embedded mode, fabOnly) */
  onToggle?: () => void;
  /** If true, only render the FAB button */
  fabOnly?: boolean;
  /** If true, render without own FAB (parent controls) */
  embedded?: boolean;
}

export function ChatWidget({ className, isOpen: controlledOpen, onClose, onToggle, fabOnly, embedded }: ChatWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    startNewSession,
  } = useChatbot();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startNewSession();
    }
  }, [isOpen, messages.length, startNewSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !fabOnly) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, fabOnly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleToggle = () => {
    if (onToggle) onToggle();
    else setInternalOpen(!internalOpen);
  };

  const handleClose = () => {
    if (onClose) onClose();
    else setInternalOpen(false);
  };

  // FAB only mode - just render the button
  if (fabOnly) {
    return (
      <Button
        onClick={handleToggle}
        size="lg"
        className={cn(
          'rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 bg-gradient-to-br from-primary to-primary/80',
          isOpen && 'rotate-180'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        )}
      </Button>
    );
  }

  // Embedded mode - just the chat window, no wrapper/FAB
  if (embedded) {
    if (!isOpen) return null;
    return (
      <div className={cn(
        'bg-card border border-border rounded-2xl shadow-xl overflow-hidden',
        isExpanded ? 'w-[500px] h-[600px]' : 'w-[380px] h-[500px]'
      )}>
        {renderChatContent()}
      </div>
    );
  }

  // Standalone mode (original behavior)
  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      {isOpen && (
        <div className={cn(
          'mb-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden transition-all duration-300 animate-scale-in',
          isExpanded ? 'w-[500px] h-[600px]' : 'w-[380px] h-[500px]'
        )}>
          {renderChatContent()}
        </div>
      )}
      <Button
        onClick={handleToggle}
        size="lg"
        className={cn(
          'rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 bg-gradient-to-br from-primary to-primary/80',
          isOpen && 'rotate-180'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        )}
      </Button>
    </div>
  );

  function renderChatContent() {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground min-h-[48px]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm leading-tight block">IRÍS</span>
              <p className="text-[10px] opacity-80 leading-tight truncate">Assistente de Busca</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 120px)' }}>
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage message={message} />
              {message.role === 'assistant' && message.metadata?.sources && (
                <ChatSources sources={message.metadata.sources} />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary animate-spin" />
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">IRÍS está pensando</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte para IRÍS..."
              className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90"
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </>
    );
  }
}

export default ChatWidget;
