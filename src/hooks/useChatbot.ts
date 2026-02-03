/**
 * ============================================================
 * HOOK: useChatbot
 * ============================================================
 * 
 * Hook para chatbot com busca semântica.
 * 
 * ARQUITETURA:
 * 1. Frontend envia mensagem do usuário
 * 2. Edge Function processa com Lovable AI Gateway
 * 3. Modelo busca nos dados do sistema (RAG pattern)
 * 4. Resposta inclui fontes e contexto
 * 
 * MODELO RECOMENDADO:
 * google/gemini-3-flash-preview - Rápido e eficiente
 * 
 * INTEGRAÇÃO BACKEND:
 * - Edge Function: /functions/chat
 * - Tabelas: chat_sessions, chat_messages
 * - Optional: pgvector para embeddings
 * ============================================================
 */

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, ChatSession, SearchSource } from '@/types/backend';

// ==================== MOCK RESPONSES ====================

const MOCK_RESPONSES: Record<string, { content: string; sources: SearchSource[] }> = {
  dec: {
    content: 'O indicador DEC (Duração Equivalente por Consumidor) da Coelba está em **12.5 horas**, com tendência de **queda**. Este indicador mede o tempo médio de interrupção de energia por consumidor. Há 5 relatórios disponíveis para análise detalhada.',
    sources: [
      { type: 'indicator', id: 'ind-dec', name: 'DEC - Duração Equivalente por Consumidor', path: ['Coelba', 'Superintendência Operação Centro Norte', 'Gerência de Manutenção', 'Eficiência de Rede'] },
    ],
  },
  fec: {
    content: 'O indicador FEC (Frequência Equivalente por Consumidor) está em **8.2 interrupções**, mantendo-se estável. Este indicador representa a quantidade média de interrupções por consumidor.',
    sources: [
      { type: 'indicator', id: 'ind-fec', name: 'FEC - Frequência Equivalente por Consumidor', path: ['Coelba', 'Superintendência Operação Centro Norte', 'Gerência de Manutenção', 'Eficiência de Rede'] },
    ],
  },
  perdas: {
    content: 'O Índice de Perdas Técnicas está em **6.8%**, com tendência de queda. Isso indica uma melhoria na eficiência da rede de distribuição. O projeto de Redução de Perdas Técnicas da Coelba tem 4 relatórios disponíveis.',
    sources: [
      { type: 'indicator', id: 'ind-perdas', name: 'Índice de Perdas Técnicas', path: ['Coelba', 'Superintendência Operação Centro Norte', 'Gerência de Manutenção', 'Redução de Perdas Técnicas'] },
    ],
  },
  default: {
    content: 'Posso ajudá-lo a encontrar indicadores e relatórios da Neoenergia. Experimente perguntar sobre:\n\n• **DEC** - Duração de interrupções\n• **FEC** - Frequência de interrupções\n• **Perdas Técnicas** - Eficiência da rede\n• **Satisfação do Cliente** - ISQP\n\nOu busque por uma empresa específica como Coelba, Cosern, Elektro, etc.',
    sources: [],
  },
};

// ==================== HOOK ====================

interface UseChatbotReturn {
  messages: ChatMessage[];
  session: ChatSession | null;
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  startNewSession: () => Promise<void>;
  
  // Session
  loadSession: (sessionId: string) => Promise<void>;
  getSessions: () => Promise<ChatSession[]>;
}

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Iniciar nova sessão de chat
   */
  const startNewSession = useCallback(async () => {
    const newSession: ChatSession = {
      id: 'sess-' + Date.now(),
      user_id: 'usr-current',
      title: 'Nova conversa',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setSession(newSession);
    setMessages([
      {
        id: 'msg-welcome',
        session_id: newSession.id,
        role: 'assistant',
        content: 'Olá! 👋 Sou o assistente do NeoView. Posso ajudá-lo a encontrar indicadores e relatórios das empresas Neoenergia. Como posso ajudar?',
        created_at: new Date().toISOString(),
      },
    ]);
    setError(null);
  }, []);

  /**
   * Enviar mensagem
   * 
   * BACKEND (Edge Function):
   * ```typescript
   * // supabase/functions/chat/index.ts
   * import { createClient } from '@supabase/supabase-js';
   * 
   * const LOVABLE_AI_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
   * 
   * Deno.serve(async (req) => {
   *   const { message, sessionId, history } = await req.json();
   *   
   *   // 1. Buscar contexto relevante (indicadores, relatórios)
   *   const context = await searchRelevantData(message);
   *   
   *   // 2. Chamar Lovable AI Gateway
   *   const response = await fetch(LOVABLE_AI_URL, {
   *     method: 'POST',
   *     headers: {
   *       'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
   *       'Content-Type': 'application/json',
   *     },
   *     body: JSON.stringify({
   *       model: 'google/gemini-3-flash-preview',
   *       messages: [
   *         { role: 'system', content: SYSTEM_PROMPT + context },
   *         ...history,
   *         { role: 'user', content: message },
   *       ],
   *       max_tokens: 1000,
   *     }),
   *   });
   *   
   *   return new Response(JSON.stringify(await response.json()));
   * });
   * ```
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      session_id: session?.id || 'temp',
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Determinar resposta baseada na mensagem
      const lowerContent = content.toLowerCase();
      let response = MOCK_RESPONSES.default;

      if (lowerContent.includes('dec') || lowerContent.includes('duração')) {
        response = MOCK_RESPONSES.dec;
      } else if (lowerContent.includes('fec') || lowerContent.includes('frequência')) {
        response = MOCK_RESPONSES.fec;
      } else if (lowerContent.includes('perda') || lowerContent.includes('técnica')) {
        response = MOCK_RESPONSES.perdas;
      }

      // Simular digitação
      await new Promise(resolve => setTimeout(resolve, 500));

      const assistantMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        session_id: session?.id || 'temp',
        role: 'assistant',
        content: response.content,
        metadata: {
          sources: response.sources,
          model: 'google/gemini-3-flash-preview',
          tokens_used: Math.floor(Math.random() * 500) + 100,
        },
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return;
      }
      setError('Erro ao processar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [session, isLoading]);

  /**
   * Limpar chat
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setSession(null);
    setError(null);
  }, []);

  /**
   * Carregar sessão existente
   */
  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    
    try {
      // TODO: supabase.from('chat_messages').select('*').eq('session_id', sessionId)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock: retornar sessão vazia
      setSession({
        id: sessionId,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      setError('Erro ao carregar sessão');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Buscar sessões do usuário
   */
  const getSessions = useCallback(async (): Promise<ChatSession[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [];
    } catch {
      return [];
    }
  }, []);

  return {
    messages,
    session,
    isLoading,
    isTyping,
    error,
    sendMessage,
    clearChat,
    startNewSession,
    loadSession,
    getSessions,
  };
}

export default useChatbot;
