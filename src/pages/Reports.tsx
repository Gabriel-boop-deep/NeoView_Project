/**
 * ============================================================
 * PAGE: Reports
 * ============================================================
 * 
 * Página de gerenciamento de relatórios PDF.
 * Inclui upload, visualização e sistema de aprovação.
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/TopNavbar';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatWidget } from '@/components/Chatbot';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Upload, 
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  MoreVertical,
  Trash2,
  Send
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useReports } from '@/hooks/useReports';
import type { ReportEntity, ReportStatus } from '@/types/backend';

const statusConfig: Record<ReportStatus, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: 'Rascunho', color: 'bg-muted text-muted-foreground', icon: AlertCircle },
  pending_approval: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
  archived: { label: 'Arquivado', color: 'bg-muted text-muted-foreground', icon: FileText },
};

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { reports, isLoading, error, fetchReports, submitForApproval, deleteReport } = useReports();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleLogout = () => {
    localStorage.removeItem('neoview_auth');
    navigate('/');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && r.status === activeTab;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending_approval').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isAuthenticated={true}
        onLogout={handleLogout}
      />

      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Relatórios</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie os relatórios PDF do sistema
              </p>
            </div>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Enviar Relatório
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                    <p className="text-xs text-muted-foreground">Aprovados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                    <p className="text-xs text-muted-foreground">Rejeitados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar relatórios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              <TabsTrigger value="pending_approval">Pendentes</TabsTrigger>
              <TabsTrigger value="approved">Aprovados</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitados</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Carregando relatórios...</p>
                    </div>
                  ) : filteredReports.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum relatório encontrado</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 'Tente uma busca diferente' : 'Envie seu primeiro relatório'}
                      </p>
                      <Button className="gap-2">
                        <Upload className="w-4 h-4" />
                        Enviar Relatório
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Tamanho</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Versão</TableHead>
                          <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.map((report) => {
                          const status = statusConfig[report.status];
                          const StatusIcon = status.icon;
                          
                          return (
                            <TableRow key={report.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-red-500" />
                                  <div>
                                    <p className="font-medium">{report.name}</p>
                                    {report.description && (
                                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {report.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={`gap-1 ${status.color}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {status.label}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatFileSize(report.file_size)}</TableCell>
                              <TableCell>{formatDate(report.uploaded_at)}</TableCell>
                              <TableCell>v{report.version}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Visualizar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    {report.status === 'draft' && (
                                      <DropdownMenuItem onClick={() => submitForApproval(report.id)}>
                                        <Send className="w-4 h-4 mr-2" />
                                        Enviar para Aprovação
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => deleteReport(report.id)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Reports;
