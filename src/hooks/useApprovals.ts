/**
 * ============================================================
 * HOOK: useApprovals
 * ============================================================
 * 
 * Hook para sistema de aprovação de relatórios.
 * 
 * FLUXO DE APROVAÇÃO:
 * 1. Analista faz upload do relatório (status: draft)
 * 2. Analista submete para aprovação (status: pending_approval)
 * 3. Supervisor visualiza e decide (approved/rejected)
 * 4. Se rejeitado, volta para draft com comentários
 * 
 * INTEGRAÇÃO BACKEND:
 * - Tabela: report_approvals
 * - Trigger: Atualizar status do relatório após decisão
 * - RLS: Supervisores só veem relatórios de suas áreas
 * ============================================================
 */

import { useState, useCallback } from 'react';
import type { 
  ReportEntity, 
  ReportApproval, 
  ApprovalStatus,
  AreaSupervisor 
} from '@/types/backend';

// ==================== MOCK DATA ====================

const MOCK_PENDING: Array<ReportEntity & { submitter_name: string; indicator_name: string }> = [
  {
    id: 'rep-002',
    indicator_id: 'ind-fec',
    name: 'Relatório FEC Q4 2024.pdf',
    description: 'Relatório trimestral de FEC',
    file_url: '/placeholder.svg',
    file_path: 'reports/2024/q4/fec-report.pdf',
    file_size: 1992294,
    mime_type: 'application/pdf',
    status: 'pending_approval',
    uploaded_by: 'usr-003',
    uploaded_at: '2024-12-16T09:00:00Z',
    version: 1,
    created_at: '2024-12-16T09:00:00Z',
    updated_at: '2024-12-16T09:00:00Z',
    submitter_name: 'João Santos',
    indicator_name: 'FEC - Frequência Equivalente por Consumidor',
  },
];

const MOCK_HISTORY: ReportApproval[] = [
  {
    id: 'apv-001',
    report_id: 'rep-001',
    approver_id: 'usr-002',
    status: 'approved',
    comments: 'Relatório está completo e dentro dos padrões.',
    approved_at: '2024-12-15T14:00:00Z',
    created_at: '2024-12-15T10:35:00Z',
    updated_at: '2024-12-15T14:00:00Z',
  },
];

// ==================== TYPES ====================

interface PendingApproval extends ReportEntity {
  submitter_name: string;
  indicator_name: string;
  project_name?: string;
  company_name?: string;
}

interface ApprovalStats {
  pending: number;
  approved_today: number;
  rejected_today: number;
  avg_approval_time_hours: number;
}

// ==================== HOOK ====================

interface UseApprovalsReturn {
  pendingApprovals: PendingApproval[];
  approvalHistory: ReportApproval[];
  stats: ApprovalStats;
  isLoading: boolean;
  error: string | null;
  
  // Fetch
  fetchPendingApprovals: () => Promise<void>;
  fetchApprovalHistory: (reportId?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  
  // Actions
  approveReport: (reportId: string, comments?: string) => Promise<boolean>;
  rejectReport: (reportId: string, comments: string) => Promise<boolean>;
  
  // Supervisor
  isSupervisorFor: (entityType: string, entityId: string) => Promise<boolean>;
  getMyApprovalAreas: () => Promise<AreaSupervisor[]>;
}

export function useApprovals(): UseApprovalsReturn {
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [approvalHistory, setApprovalHistory] = useState<ReportApproval[]>([]);
  const [stats, setStats] = useState<ApprovalStats>({
    pending: 0,
    approved_today: 0,
    rejected_today: 0,
    avg_approval_time_hours: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar relatórios pendentes de aprovação
   * 
   * BACKEND:
   * ```typescript
   * const { data, error } = await supabase
   *   .from('reports')
   *   .select(`
   *     *,
   *     indicators!inner(name, projects!inner(name, managements!inner(
   *       superintendences!inner(companies!inner(name))
   *     ))),
   *     profiles!uploaded_by(full_name)
   *   `)
   *   .eq('status', 'pending_approval')
   *   .order('uploaded_at', { ascending: true });
   * ```
   */
  const fetchPendingApprovals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPendingApprovals(MOCK_PENDING);
      setStats(prev => ({ ...prev, pending: MOCK_PENDING.length }));
    } catch (err) {
      setError('Erro ao buscar aprovações pendentes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Buscar histórico de aprovações
   */
  const fetchApprovalHistory = useCallback(async (reportId?: string) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (reportId) {
        setApprovalHistory(MOCK_HISTORY.filter(a => a.report_id === reportId));
      } else {
        setApprovalHistory(MOCK_HISTORY);
      }
    } catch (err) {
      setError('Erro ao buscar histórico');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Buscar estatísticas de aprovação
   */
  const fetchStats = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setStats({
        pending: MOCK_PENDING.length,
        approved_today: 3,
        rejected_today: 1,
        avg_approval_time_hours: 4.5,
      });
    } catch (err) {
      console.error('Erro ao buscar estatísticas');
    }
  }, []);

  /**
   * Aprovar relatório
   * 
   * BACKEND:
   * ```typescript
   * // 1. Criar registro de aprovação
   * const { error: approvalError } = await supabase
   *   .from('report_approvals')
   *   .insert({
   *     report_id: reportId,
   *     approver_id: userId,
   *     status: 'approved',
   *     comments,
   *     approved_at: new Date().toISOString(),
   *   });
   * 
   * // 2. Atualizar status do relatório (pode ser trigger)
   * const { error: updateError } = await supabase
   *   .from('reports')
   *   .update({ status: 'approved' })
   *   .eq('id', reportId);
   * ```
   */
  const approveReport = useCallback(async (reportId: string, comments?: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Remover da lista de pendentes
      setPendingApprovals(prev => prev.filter(p => p.id !== reportId));
      
      // Adicionar ao histórico
      const newApproval: ReportApproval = {
        id: 'apv-' + Date.now(),
        report_id: reportId,
        approver_id: 'usr-current',
        status: 'approved',
        comments,
        approved_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setApprovalHistory(prev => [newApproval, ...prev]);
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved_today: prev.approved_today + 1,
      }));

      return true;
    } catch (err) {
      setError('Erro ao aprovar relatório');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Rejeitar relatório
   */
  const rejectReport = useCallback(async (reportId: string, comments: string): Promise<boolean> => {
    if (!comments.trim()) {
      setError('Comentário obrigatório para rejeição');
      return false;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      setPendingApprovals(prev => prev.filter(p => p.id !== reportId));
      
      const newApproval: ReportApproval = {
        id: 'apv-' + Date.now(),
        report_id: reportId,
        approver_id: 'usr-current',
        status: 'rejected',
        comments,
        approved_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setApprovalHistory(prev => [newApproval, ...prev]);
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        rejected_today: prev.rejected_today + 1,
      }));

      return true;
    } catch (err) {
      setError('Erro ao rejeitar relatório');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verificar se usuário é supervisor de uma área
   * 
   * BACKEND:
   * ```typescript
   * const { data } = await supabase
   *   .from('area_supervisors')
   *   .select('*')
   *   .eq('user_id', userId)
   *   .eq('entity_type', entityType)
   *   .eq('entity_id', entityId)
   *   .eq('can_approve_reports', true)
   *   .single();
   * 
   * return !!data;
   * ```
   */
  const isSupervisorFor = useCallback(async (entityType: string, entityId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      // Mock: sempre retorna true para demonstração
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Buscar áreas onde usuário é supervisor
   */
  const getMyApprovalAreas = useCallback(async (): Promise<AreaSupervisor[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [
        {
          id: 'as-001',
          user_id: 'usr-002',
          entity_type: 'superintendence',
          entity_id: 'sup-operacoes-ba',
          can_approve_reports: true,
          created_at: new Date().toISOString(),
        },
      ];
    } catch {
      return [];
    }
  }, []);

  return {
    pendingApprovals,
    approvalHistory,
    stats,
    isLoading,
    error,
    fetchPendingApprovals,
    fetchApprovalHistory,
    fetchStats,
    approveReport,
    rejectReport,
    isSupervisorFor,
    getMyApprovalAreas,
  };
}

export default useApprovals;
