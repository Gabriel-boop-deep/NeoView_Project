/**
 * ============================================================
 * HOOK: useReports
 * ============================================================
 * 
 * Hook para gerenciamento de relatórios PDF.
 * 
 * INTEGRAÇÃO BACKEND:
 * 1. Upload: supabase.storage.from('reports').upload()
 * 2. CRUD: supabase.from('reports')
 * 3. Aprovações: supabase.from('report_approvals')
 * 
 * STORAGE BUCKET:
 * Criar bucket 'reports' com política de acesso:
 * - SELECT: authenticated users
 * - INSERT: authenticated users (próprio user_id)
 * - UPDATE/DELETE: owner ou admin
 * ============================================================
 */

import { useState, useCallback } from 'react';
import type { 
  ReportEntity, 
  ReportApproval, 
  ReportStatus,
  PaginatedResponse,
  SearchFilters,
  FileUploadResponse 
} from '@/types/backend';

// ==================== MOCK DATA ====================

const MOCK_REPORTS: ReportEntity[] = [
  {
    id: 'rep-001',
    indicator_id: 'ind-dec',
    name: 'Relatório DEC Q4 2024.pdf',
    description: 'Relatório trimestral de DEC',
    file_url: '/placeholder.svg',
    file_path: 'reports/2024/q4/dec-report.pdf',
    file_size: 2516582,
    mime_type: 'application/pdf',
    status: 'approved',
    uploaded_by: 'usr-001',
    uploaded_at: '2024-12-15T10:30:00Z',
    version: 1,
    created_at: '2024-12-15T10:30:00Z',
    updated_at: '2024-12-15T14:00:00Z',
  },
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
  },
  {
    id: 'rep-003',
    indicator_id: 'ind-perdas',
    name: 'Análise Perdas Técnicas 2024.pdf',
    description: 'Análise anual de perdas técnicas',
    file_url: '/placeholder.svg',
    file_path: 'reports/2024/annual/perdas-tecnicas.pdf',
    file_size: 3355443,
    mime_type: 'application/pdf',
    status: 'draft',
    uploaded_by: 'usr-003',
    uploaded_at: '2024-12-17T15:20:00Z',
    version: 2,
    created_at: '2024-12-10T11:00:00Z',
    updated_at: '2024-12-17T15:20:00Z',
  },
];

// ==================== HOOK ====================

interface UseReportsReturn {
  reports: ReportEntity[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD
  fetchReports: (filters?: SearchFilters) => Promise<PaginatedResponse<ReportEntity>>;
  getReportById: (id: string) => Promise<ReportEntity | null>;
  getReportsByIndicator: (indicatorId: string) => Promise<ReportEntity[]>;
  
  // Upload
  uploadReport: (file: File, indicatorId: string, metadata?: Partial<ReportEntity>) => Promise<FileUploadResponse | null>;
  updateReport: (id: string, data: Partial<ReportEntity>) => Promise<boolean>;
  deleteReport: (id: string) => Promise<boolean>;
  
  // Versioning
  uploadNewVersion: (reportId: string, file: File, changeNotes?: string) => Promise<boolean>;
  
  // Approval
  submitForApproval: (reportId: string) => Promise<boolean>;
  getPendingApprovals: () => Promise<ReportEntity[]>;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<ReportEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar relatórios com filtros
   * 
   * BACKEND:
   * ```typescript
   * const { data, error, count } = await supabase
   *   .from('reports')
   *   .select('*', { count: 'exact' })
   *   .eq('indicator_id', filters.indicatorId)
   *   .order('created_at', { ascending: false })
   *   .range(offset, offset + limit - 1);
   * ```
   */
  const fetchReports = useCallback(async (filters?: SearchFilters): Promise<PaginatedResponse<ReportEntity>> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      let filtered = [...MOCK_REPORTS];

      if (filters?.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(r => 
          r.name.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query)
        );
      }

      if (filters?.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }

      const page = filters?.page || 1;
      const perPage = filters?.per_page || 10;
      const start = (page - 1) * perPage;
      const paged = filtered.slice(start, start + perPage);

      setReports(paged);

      return {
        data: paged,
        pagination: {
          page,
          per_page: perPage,
          total: filtered.length,
          total_pages: Math.ceil(filtered.length / perPage),
        },
      };
    } catch (err) {
      setError('Erro ao buscar relatórios');
      return { data: [], pagination: { page: 1, per_page: 10, total: 0, total_pages: 0 } };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Buscar relatório por ID
   */
  const getReportById = useCallback(async (id: string): Promise<ReportEntity | null> => {
    try {
      // TODO: supabase.from('reports').select('*').eq('id', id).single()
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_REPORTS.find(r => r.id === id) || null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Buscar relatórios por indicador
   */
  const getReportsByIndicator = useCallback(async (indicatorId: string): Promise<ReportEntity[]> => {
    try {
      // TODO: supabase.from('reports').select('*').eq('indicator_id', indicatorId)
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_REPORTS.filter(r => r.indicator_id === indicatorId);
    } catch {
      return [];
    }
  }, []);

  /**
   * Upload de novo relatório
   * 
   * BACKEND:
   * ```typescript
   * // 1. Upload file to storage
   * const filePath = `reports/${userId}/${Date.now()}_${file.name}`;
   * const { data: uploadData, error: uploadError } = await supabase.storage
   *   .from('reports')
   *   .upload(filePath, file);
   * 
   * // 2. Get public URL
   * const { data: { publicUrl } } = supabase.storage
   *   .from('reports')
   *   .getPublicUrl(filePath);
   * 
   * // 3. Insert record
   * const { data, error } = await supabase.from('reports').insert({
   *   indicator_id: indicatorId,
   *   name: file.name,
   *   file_url: publicUrl,
   *   file_path: filePath,
   *   file_size: file.size,
   *   mime_type: file.type,
   *   status: 'draft',
   *   uploaded_by: userId,
   * }).select().single();
   * ```
   */
  const uploadReport = useCallback(async (
    file: File, 
    indicatorId: string, 
    metadata?: Partial<ReportEntity>
  ): Promise<FileUploadResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newReport: ReportEntity = {
        id: 'rep-' + Date.now(),
        indicator_id: indicatorId,
        name: file.name,
        description: metadata?.description,
        file_url: URL.createObjectURL(file),
        file_path: `reports/${Date.now()}_${file.name}`,
        file_size: file.size,
        mime_type: file.type,
        status: 'draft',
        uploaded_by: 'usr-current',
        uploaded_at: new Date().toISOString(),
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...metadata,
      };

      MOCK_REPORTS.push(newReport);
      setReports(prev => [newReport, ...prev]);

      return {
        id: newReport.id,
        file_url: newReport.file_url,
        file_path: newReport.file_path,
        file_size: newReport.file_size,
        mime_type: newReport.mime_type,
      };
    } catch (err) {
      setError('Erro ao fazer upload do relatório');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualizar relatório
   */
  const updateReport = useCallback(async (id: string, data: Partial<ReportEntity>): Promise<boolean> => {
    try {
      // TODO: supabase.from('reports').update(data).eq('id', id)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = MOCK_REPORTS.findIndex(r => r.id === id);
      if (index >= 0) {
        MOCK_REPORTS[index] = { ...MOCK_REPORTS[index], ...data, updated_at: new Date().toISOString() };
        setReports(prev => prev.map(r => r.id === id ? MOCK_REPORTS[index] : r));
      }
      
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Excluir relatório
   */
  const deleteReport = useCallback(async (id: string): Promise<boolean> => {
    try {
      // TODO: 
      // 1. supabase.storage.from('reports').remove([filePath])
      // 2. supabase.from('reports').delete().eq('id', id)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = MOCK_REPORTS.findIndex(r => r.id === id);
      if (index >= 0) {
        MOCK_REPORTS.splice(index, 1);
        setReports(prev => prev.filter(r => r.id !== id));
      }
      
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Upload de nova versão
   */
  const uploadNewVersion = useCallback(async (
    reportId: string, 
    file: File, 
    changeNotes?: string
  ): Promise<boolean> => {
    try {
      // TODO:
      // 1. Copiar registro atual para report_versions
      // 2. Upload novo arquivo
      // 3. Atualizar registro principal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const report = MOCK_REPORTS.find(r => r.id === reportId);
      if (report) {
        report.version += 1;
        report.file_url = URL.createObjectURL(file);
        report.file_size = file.size;
        report.updated_at = new Date().toISOString();
        setReports(prev => prev.map(r => r.id === reportId ? report : r));
      }
      
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Submeter para aprovação
   */
  const submitForApproval = useCallback(async (reportId: string): Promise<boolean> => {
    return updateReport(reportId, { status: 'pending_approval' });
  }, [updateReport]);

  /**
   * Buscar relatórios pendentes de aprovação
   */
  const getPendingApprovals = useCallback(async (): Promise<ReportEntity[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_REPORTS.filter(r => r.status === 'pending_approval');
    } catch {
      return [];
    }
  }, []);

  return {
    reports,
    isLoading,
    error,
    fetchReports,
    getReportById,
    getReportsByIndicator,
    uploadReport,
    updateReport,
    deleteReport,
    uploadNewVersion,
    submitForApproval,
    getPendingApprovals,
  };
}

export default useReports;
