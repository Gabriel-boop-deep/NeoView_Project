export interface PdfReport {
  id: string;
  name: string;
  date: string;
  size: string;
}



export interface IndicatorComment {
  id: string;       // ← chave estável para React key
  author: string;
  text: string;
  date: string;
}



export interface Indicator {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  reports: PdfReport[];

  // Novos parâmetros
  likes?: number;
  views?: number;
  commentsCount?: number;
  comments?: IndicatorComment[];
  userHasLiked?: boolean;
}



export interface Project {
  id: string;
  name: string;
  description: string;
  indicators: Indicator[];
}

export interface Management {
  id: string;
  name: string;
  projects: Project[];
}

export interface Superintendence {
  id: string;
  name: string;
  managements: Management[];
}

export interface Company {
  id: string;
  name: string;
  fullName: string;
  superintendences: Superintendence[];
}

export const companies: Company[] = [
  {
    id: 'coelba',
    name: 'Coelba',
    fullName: 'Neoenergia Coelba',
    superintendences: [
      
{
  id: 'sup-relacionamento-clientes',
  name: 'Superintendência de Relacionamento com Clientes',
  managements: [
    {
      id: 'ger-receita',
      name: 'Gerência da Gestão da Receita',
      projects: [
                {
                  id: 'uni-gestao-operacional-comercial',
                  name: 'Unidade Gestão Operacional Comercial',
                  description: 'Gestão operacional das atividades comerciais (processos, SLA, indicadores e melhorias).',
                  indicators: [{
                    id: 'ind-cobertura',
                    name: 'Índice de Cobertura',
                    value: '98.2',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-7', name: 'Relatório Expansão 2024.pdf', date: '2024-12-05', size: '2.8 MB' },
                      { id: 'rep-7a', name: 'Mapa Cobertura RN 2024.pdf', date: '2024-12-01', size: '6.2 MB' },
                      { id: 'rep-7b', name: 'Plano Expansão 2025-2027.pdf', date: '2024-11-28', size: '3.9 MB' },
                      { id: 'rep-7c', name: 'Investimentos Infraestrutura.pdf', date: '2024-11-20', size: '2.5 MB' },
                    ],
                  },
                ],
                },
                {
                  id: 'uni-recuperacao-energia',
                  name: 'Unidade Recuperação de Energia',
                  description: 'Ações de recuperação de energia e combate a irregularidades em geração distribuída e consumo.',
                  indicators: [{
                    id: 'ind-cobertura',
                    name: 'Índice de Cobertura',
                    value: '98.2',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-7', name: 'Relatório Expansão 2025.pdf', date: '2026-01-07', size: '2.8 MB' },
                      { id: 'rep-7a', name: 'Mapa Cobertura BA 2025.pdf', date: '2025-12-01', size: '6.2 MB' },
                      { id: 'rep-7b', name: 'Plano Expansão 2025-2027.pdf', date: '2025-04-28', size: '3.9 MB' },
                      { id: 'rep-7c', name: 'Investimentos Infraestrutura.pdf', date: '2024-07-20', size: '2.5 MB' },
                    ],
                  },{
                    id: 'ind-gd',
                    name: 'Conexões GD',
                    value: '15420',
                    unit: 'unidades',
                    trend: 'up',
                    reports: [
                      { id: 'rep-10', name: 'Relatório GD 2025.pdf', date: '2025-10-08', size: '2.1 MB' },
                      { id: 'rep-10a', name: 'Mapa Solar Salvador.pdf', date: '2025-07-05', size: '7.3 MB' },
                      { id: 'rep-10b', name: 'Análise Impacto Rede GD.pdf', date: '2025-09-01', size: '3.2 MB' },
                      { id: 'rep-10c', name: 'Projeção Conexões 2025.pdf', date: '2025-03-28', size: '1.8 MB' },
                      { id: 'rep-10d', name: 'Regulamentação ANEEL GD.pdf', date: '2025-11-20', size: '2.4 MB' },
                    ],
                  },{
                    id: 'ind-automacao',
                    name: 'Nível de Automação',
                    value: '45',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-8', name: 'Projeto Smart Grid.pdf', date: '2025-06-28', size: '5.2 MB' },
                      { id: 'rep-8a', name: 'Arquitetura Smart Grid DF.pdf', date: '2025-08-25', size: '4.1 MB' },
                      { id: 'rep-8b', name: 'ROI Automação de Rede.pdf', date: '2025-02-20', size: '2.3 MB' },
                      { id: 'rep-8c', name: 'Cronograma Implantação 2025.pdf', date: '2025-04-15', size: '1.8 MB' },
                      { id: 'rep-8d', name: 'Estudo Viabilidade Técnica.pdf', date: '2025-11-10', size: '3.6 MB' },
                      { id: 'rep-8d', name: 'Automação Envio Cartas.pdf', date: '2025-08-10', size: '4.6 MB' },
                    ],
                  },
                ],
                },
                {
                  id: 'uni-recuperacao-credito',
                  name: 'Unidade de Recuperação de Crédito',
                  description: 'Estratégias e operações de cobrança e recuperação de crédito (inadimplência).',
                  indicators: [{
                    id: 'ind-cobertura',
                    name: 'Índice de Cobertura',
                    value: '98.2',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-7', name: 'Relatório Expansão 2024.pdf', date: '2024-12-05', size: '2.8 MB' },
                      { id: 'rep-7a', name: 'Mapa Cobertura RN 2024.pdf', date: '2024-12-01', size: '6.2 MB' },
                      { id: 'rep-7b', name: 'Plano Expansão 2025-2027.pdf', date: '2024-11-28', size: '3.9 MB' },
                      { id: 'rep-7c', name: 'Investimentos Infraestrutura.pdf', date: '2024-11-20', size: '2.5 MB' },
                    ],
                  },
                ],
                },
              ],
            },
                {
                  id: 'ger-grandes-clientes',
                  name: 'Gerência de Grandes Clientes',
                  projects: [
                {
                  id: 'uni-gestao-operacional-comercial',
                  name: 'Unidade Gestão Operacional Comercial',
                  description: 'Gestão operacional das atividades comerciais (processos, SLA, indicadores e melhorias).',
                  indicators: [],
                },
                {
                  id: 'uni-recuperacao-energia',
                  name: 'Unidade Recuperação de Energia',
                  description: 'Ações de recuperação de energia e combate a irregularidades em geração distribuída e consumo.',
                  indicators: [],
                },
                {
                  id: 'uni-recuperacao-credito',
                  name: 'Unidade de Recuperação de Crédito',
                  description: 'Estratégias e operações de cobrança e recuperação de crédito (inadimplência).',
                  indicators: [],
                },
              ],
                },
                {
                  id: 'ger-relacionamento-poder-publico',
                  name: 'Gerência de Relacionamento com o Poder Público',
                  projects: [
                {
                  id: 'uni-gestao-operacional-comercial',
                  name: 'Unidade Gestão Operacional Comercial',
                  description: 'Gestão operacional das atividades comerciais (processos, SLA, indicadores e melhorias).',
                  indicators: [],
                },
                {
                  id: 'uni-recuperacao-energia',
                  name: 'Unidade Recuperação de Energia',
                  description: 'Ações de recuperação de energia e combate a irregularidades em geração distribuída e consumo.',
                  indicators: [],
                },
                {
                  id: 'uni-recuperacao-credito',
                  name: 'Unidade de Recuperação de Crédito',
                  description: 'Estratégias e operações de cobrança e recuperação de crédito (inadimplência).',
                  indicators: [],
                },
              ],
                },

          ],
        },

      {
        id: 'sup-operacoes-ba',
        name: 'Superintendência Operação Centro Norte',
        managements: [
          {
            id: 'ger-manutencao',
            name: 'Gerência de Manutenção',
            projects: [
              {
                id: 'proj-eficiencia-rede',
                name: 'Eficiência de Rede',
                description: 'Otimização da rede de distribuição',
                indicators: [
                  {
                    id: 'ind-dec',
                    name: 'DEC - Duração Equivalente por Consumidor',
                    value: '12.5',
                    unit: 'horas',
                    trend: 'down',
                    reports: [
                      { id: 'rep-1', name: 'Relatório DEC Q4 2024.pdf', date: '2024-12-15', size: '2.4 MB' },
                      { id: 'rep-2', name: 'Análise Comparativa DEC.pdf', date: '2024-11-30', size: '1.8 MB' },
                      { id: 'rep-1a', name: 'DEC Mensal Dezembro 2024.pdf', date: '2024-12-28', size: '1.2 MB' },
                      { id: 'rep-1b', name: 'DEC Histórico Anual 2024.pdf', date: '2024-12-20', size: '3.5 MB' },
                      { id: 'rep-1c', name: 'Plano de Ação DEC 2025.pdf', date: '2024-12-22', size: '2.1 MB' },
                    ],
                  },
                  {
                    id: 'ind-fec',
                    name: 'FEC - Frequência Equivalente por Consumidor',
                    value: '8.2',
                    unit: 'interrupções',
                    trend: 'stable',
                    reports: [
                      { id: 'rep-3', name: 'Relatório FEC Q4 2024.pdf', date: '2024-12-15', size: '1.9 MB' },
                      { id: 'rep-3a', name: 'FEC por Região Bahia.pdf', date: '2024-12-10', size: '2.2 MB' },
                      { id: 'rep-3b', name: 'Análise FEC vs Meta ANEEL.pdf', date: '2024-12-05', size: '1.6 MB' },
                    ],
                  },
                ],
              },
              {
                id: 'proj-reducao-perdas',
                name: 'Redução de Perdas Técnicas',
                description: 'Programa de combate às perdas técnicas',
                indicators: [
                  {
                    id: 'ind-perdas',
                    name: 'Índice de Perdas Técnicas',
                    value: '6.8',
                    unit: '%',
                    trend: 'down',
                    reports: [
                      { id: 'rep-4', name: 'Relatório Perdas Técnicas 2024.pdf', date: '2024-12-01', size: '3.2 MB' },
                      { id: 'rep-4a', name: 'Mapeamento Perdas por Alimentador.pdf', date: '2024-11-25', size: '4.8 MB' },
                      { id: 'rep-4b', name: 'Investimentos Redução Perdas.pdf', date: '2024-11-20', size: '2.3 MB' },
                      { id: 'rep-4c', name: 'Benchmark Perdas Técnicas Brasil.pdf', date: '2024-11-15', size: '1.9 MB' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ger-qualidade',
            name: 'Gerência de Qualidade',
            projects: [
              {
                id: 'proj-satisfacao',
                name: 'Satisfação do Cliente',
                description: 'Monitoramento da satisfação',
                indicators: [
                  {
                    id: 'ind-isqp',
                    name: 'ISQP - Índice de Satisfação',
                    value: '78.5',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-5', name: 'Pesquisa Satisfação 2024.pdf', date: '2024-12-10', size: '4.1 MB' },
                      { id: 'rep-5a', name: 'ISQP Detalhado por Município.pdf', date: '2024-12-08', size: '5.2 MB' },
                      { id: 'rep-5b', name: 'Plano Melhoria Satisfação.pdf', date: '2024-12-01', size: '2.8 MB' },
                      { id: 'rep-5c', name: 'Comparativo ISQP 2023-2024.pdf', date: '2024-11-28', size: '1.7 MB' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sup-expancao-ba',
        name: 'Superintendência Expansão e Preservação',
        managements: [
          {
            id: 'ger-atendimento',
            name: 'Gerência de Atendimento',
            projects: [
              {
                id: 'proj-call-center',
                name: 'Melhoria Call Center',
                description: 'Otimização do atendimento telefônico',
                indicators: [
                  {
                    id: 'ind-tma',
                    name: 'TMA - Tempo Médio de Atendimento',
                    value: '180',
                    unit: 'segundos',
                    trend: 'down',
                    reports: [
                      { id: 'rep-6', name: 'Dashboard Call Center.pdf', date: '2024-12-18', size: '1.5 MB' },
                      { id: 'rep-6a', name: 'TMA por Tipo de Chamada.pdf', date: '2024-12-15', size: '1.8 MB' },
                      { id: 'rep-6b', name: 'Relatório Produtividade Agentes.pdf', date: '2024-12-12', size: '2.4 MB' },
                      { id: 'rep-6c', name: 'Análise Picos de Demanda.pdf', date: '2024-12-10', size: '1.3 MB' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'sup-operacao-metropolitano-sul',
        name: 'Superintendência Operação Metropolitano Sul',
        managements: [
          {
            id: 'ger-qualidade',
            name: 'Gerência de Qualidade',
            projects: [
              {
                id: 'proj-satisfacao',
                name: 'Satisfação do Cliente',
                description: 'Monitoramento da satisfação',
                indicators: [
                  {
                    id: 'ind-isqp',
                    name: 'ISQP - Índice de Satisfação',
                    value: '78.5',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-5', name: 'Pesquisa Satisfação 2024.pdf', date: '2024-12-10', size: '4.1 MB' },
                      { id: 'rep-5a', name: 'ISQP Detalhado por Município.pdf', date: '2024-12-08', size: '5.2 MB' },
                      { id: 'rep-5b', name: 'Plano Melhoria Satisfação.pdf', date: '2024-12-01', size: '2.8 MB' },
                      { id: 'rep-5c', name: 'Comparativo ISQP 2023-2024.pdf', date: '2024-11-28', size: '1.7 MB' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ger-manutencao',
            name: 'Gerência de Manutenção',
            projects: [
              {
                id: 'proj-eficiencia-rede',
                name: 'Eficiência de Rede',
                description: 'Otimização da rede de distribuição',
                indicators: [
                  {
                    id: 'ind-dec',
                    name: 'DEC - Duração Equivalente por Consumidor',
                    value: '12.5',
                    unit: 'horas',
                    trend: 'down',
                    reports: [
                      { id: 'rep-1', name: 'Relatório DEC Q4 2024.pdf', date: '2024-12-15', size: '2.4 MB' },
                      { id: 'rep-2', name: 'Análise Comparativa DEC.pdf', date: '2024-11-30', size: '1.8 MB' },
                      { id: 'rep-1a', name: 'DEC Mensal Dezembro 2024.pdf', date: '2024-12-28', size: '1.2 MB' },
                      { id: 'rep-1b', name: 'DEC Histórico Anual 2024.pdf', date: '2024-12-20', size: '3.5 MB' },
                      { id: 'rep-1c', name: 'Plano de Ação DEC 2025.pdf', date: '2024-12-22', size: '2.1 MB' },
                    ],
                  },
                  {
                    id: 'ind-fec',
                    name: 'FEC - Frequência Equivalente por Consumidor',
                    value: '8.2',
                    unit: 'interrupções',
                    trend: 'stable',
                    reports: [
                      { id: 'rep-3', name: 'Relatório FEC Q4 2024.pdf', date: '2024-12-15', size: '1.9 MB' },
                      { id: 'rep-3a', name: 'FEC por Região Bahia.pdf', date: '2024-12-10', size: '2.2 MB' },
                      { id: 'rep-3b', name: 'Análise FEC vs Meta ANEEL.pdf', date: '2024-12-05', size: '1.6 MB' },
                    ],
                  },
                ],
              },
              {
                id: 'proj-reducao-perdas',
                name: 'Redução de Perdas Técnicas',
                description: 'Programa de combate às perdas técnicas',
                indicators: [
                  {
                    id: 'ind-perdas',
                    name: 'Índice de Perdas Técnicas',
                    value: '6.8',
                    unit: '%',
                    trend: 'down',
                    reports: [
                      { id: 'rep-4', name: 'Relatório Perdas Técnicas 2024.pdf', date: '2024-12-01', size: '3.2 MB' },
                      { id: 'rep-4a', name: 'Mapeamento Perdas por Alimentador.pdf', date: '2024-11-25', size: '4.8 MB' },
                      { id: 'rep-4b', name: 'Investimentos Redução Perdas.pdf', date: '2024-11-20', size: '2.3 MB' },
                      { id: 'rep-4c', name: 'Benchmark Perdas Técnicas Brasil.pdf', date: '2024-11-15', size: '1.9 MB' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ger-atendimento',
            name: 'Gerência de Atendimento',
            projects: [
              {
                id: 'proj-call-center',
                name: 'Melhoria Call Center',
                description: 'Otimização do atendimento telefônico',
                indicators: [
                  {
                    id: 'ind-tma',
                    name: 'TMA - Tempo Médio de Atendimento',
                    value: '180',
                    unit: 'segundos',
                    trend: 'down',
                    reports: [
                      { id: 'rep-6', name: 'Dashboard Call Center.pdf', date: '2024-12-18', size: '1.5 MB' },
                      { id: 'rep-6a', name: 'TMA por Tipo de Chamada.pdf', date: '2024-12-15', size: '1.8 MB' },
                      { id: 'rep-6b', name: 'Relatório Produtividade Agentes.pdf', date: '2024-12-12', size: '2.4 MB' },
                      { id: 'rep-6c', name: 'Análise Picos de Demanda.pdf', date: '2024-12-10', size: '1.3 MB' },
                    ],
                  },
                ],
              },
            ],
          }],
      },
      {
        id: 'sup-operacao-sudoeste-oeste',
        name: 'Superintendência Operação Sudoeste Oeste',
        managements: [
          {
            id: 'ger-qualidade',
            name: 'Gerência de Qualidade',
            projects: [
              {
                id: 'proj-satisfacao',
                name: 'Satisfação do Cliente',
                description: 'Monitoramento da satisfação',
                indicators: [
                  {
                    id: 'ind-isqp',
                    name: 'ISQP - Índice de Satisfação',
                    value: '78.5',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-5', name: 'Pesquisa Satisfação 2024.pdf', date: '2024-12-10', size: '4.1 MB' },
                      { id: 'rep-5a', name: 'ISQP Detalhado por Município.pdf', date: '2024-12-08', size: '5.2 MB' },
                      { id: 'rep-5b', name: 'Plano Melhoria Satisfação.pdf', date: '2024-12-01', size: '2.8 MB' },
                      { id: 'rep-5c', name: 'Comparativo ISQP 2023-2024.pdf', date: '2024-11-28', size: '1.7 MB' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ger-manutencao',
            name: 'Gerência de Manutenção',
            projects: [
              {
                id: 'proj-eficiencia-rede',
                name: 'Eficiência de Rede',
                description: 'Otimização da rede de distribuição',
                indicators: [
                  {
                    id: 'ind-dec',
                    name: 'DEC - Duração Equivalente por Consumidor',
                    value: '12.5',
                    unit: 'horas',
                    trend: 'down',
                    reports: [
                      { id: 'rep-1', name: 'Relatório DEC Q4 2024.pdf', date: '2024-12-15', size: '2.4 MB' },
                      { id: 'rep-2', name: 'Análise Comparativa DEC.pdf', date: '2024-11-30', size: '1.8 MB' },
                      { id: 'rep-1a', name: 'DEC Mensal Dezembro 2024.pdf', date: '2024-12-28', size: '1.2 MB' },
                      { id: 'rep-1b', name: 'DEC Histórico Anual 2024.pdf', date: '2024-12-20', size: '3.5 MB' },
                      { id: 'rep-1c', name: 'Plano de Ação DEC 2025.pdf', date: '2024-12-22', size: '2.1 MB' },
                    ],
                  },
                  {
                    id: 'ind-fec',
                    name: 'FEC - Frequência Equivalente por Consumidor',
                    value: '8.2',
                    unit: 'interrupções',
                    trend: 'stable',
                    reports: [
                      { id: 'rep-3', name: 'Relatório FEC Q4 2024.pdf', date: '2024-12-15', size: '1.9 MB' },
                      { id: 'rep-3a', name: 'FEC por Região Bahia.pdf', date: '2024-12-10', size: '2.2 MB' },
                      { id: 'rep-3b', name: 'Análise FEC vs Meta ANEEL.pdf', date: '2024-12-05', size: '1.6 MB' },
                    ],
                  },
                ],
              },
              {
                id: 'proj-reducao-perdas',
                name: 'Redução de Perdas Técnicas',
                description: 'Programa de combate às perdas técnicas',
                indicators: [
                  {
                    id: 'ind-perdas',
                    name: 'Índice de Perdas Técnicas',
                    value: '6.8',
                    unit: '%',
                    trend: 'down',
                    reports: [
                      { id: 'rep-4', name: 'Relatório Perdas Técnicas 2024.pdf', date: '2024-12-01', size: '3.2 MB' },
                      { id: 'rep-4a', name: 'Mapeamento Perdas por Alimentador.pdf', date: '2024-11-25', size: '4.8 MB' },
                      { id: 'rep-4b', name: 'Investimentos Redução Perdas.pdf', date: '2024-11-20', size: '2.3 MB' },
                      { id: 'rep-4c', name: 'Benchmark Perdas Técnicas Brasil.pdf', date: '2024-11-15', size: '1.9 MB' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ger-atendimento',
            name: 'Gerência de Atendimento',
            projects: [
              {
                id: 'proj-call-center',
                name: 'Melhoria Call Center',
                description: 'Otimização do atendimento telefônico',
                indicators: [
                  {
                    id: 'ind-tma',
                    name: 'TMA - Tempo Médio de Atendimento',
                    value: '180',
                    unit: 'segundos',
                    trend: 'down',
                    reports: [
                      { id: 'rep-6', name: 'Dashboard Call Center.pdf', date: '2024-12-18', size: '1.5 MB' },
                      { id: 'rep-6a', name: 'TMA por Tipo de Chamada.pdf', date: '2024-12-15', size: '1.8 MB' },
                      { id: 'rep-6b', name: 'Relatório Produtividade Agentes.pdf', date: '2024-12-12', size: '2.4 MB' },
                      { id: 'rep-6c', name: 'Análise Picos de Demanda.pdf', date: '2024-12-10', size: '1.3 MB' },
                    ],
                  },
                ],
              },
            ],
          }],
      },
      {
        id: 'sup-tecnica-coelba',
        name: 'Superintendência Técnica Coelba',
        managements: [
          {
            id: 'ger-qualidade',
            name: 'Gerência de Qualidade',
            projects: [
              {
                id: 'proj-satisfacao',
                name: 'Satisfação do Cliente',
                description: 'Monitoramento da satisfação',
                indicators: [
                  {
                    id: 'ind-isqp',
                    name: 'ISQP - Índice de Satisfação',
                    value: '78.5',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-5', name: 'Pesquisa Satisfação 2024.pdf', date: '2024-12-10', size: '4.1 MB' },
                      { id: 'rep-5a', name: 'ISQP Detalhado por Município.pdf', date: '2024-12-08', size: '5.2 MB' },
                      { id: 'rep-5b', name: 'Plano Melhoria Satisfação.pdf', date: '2024-12-01', size: '2.8 MB' },
                      { id: 'rep-5c', name: 'Comparativo ISQP 2023-2024.pdf', date: '2024-11-28', size: '1.7 MB' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ger-manutencao',
            name: 'Gerência de Manutenção',
            projects: [
              {
                id: 'proj-eficiencia-rede',
                name: 'Eficiência de Rede',
                description: 'Otimização da rede de distribuição',
                indicators: [
                  {
                    id: 'ind-dec',
                    name: 'DEC - Duração Equivalente por Consumidor',
                    value: '12.5',
                    unit: 'horas',
                    trend: 'down',
                    reports: [
                      { id: 'rep-1', name: 'Relatório DEC Q4 2024.pdf', date: '2024-12-15', size: '2.4 MB' },
                      { id: 'rep-2', name: 'Análise Comparativa DEC.pdf', date: '2024-11-30', size: '1.8 MB' },
                      { id: 'rep-1a', name: 'DEC Mensal Dezembro 2024.pdf', date: '2024-12-28', size: '1.2 MB' },
                      { id: 'rep-1b', name: 'DEC Histórico Anual 2024.pdf', date: '2024-12-20', size: '3.5 MB' },
                      { id: 'rep-1c', name: 'Plano de Ação DEC 2025.pdf', date: '2024-12-22', size: '2.1 MB' },
                    ],
                  },
                  {
                    id: 'ind-fec',
                    name: 'FEC - Frequência Equivalente por Consumidor',
                    value: '8.2',
                    unit: 'interrupções',
                    trend: 'stable',
                    reports: [
                      { id: 'rep-3', name: 'Relatório FEC Q4 2024.pdf', date: '2024-12-15', size: '1.9 MB' },
                      { id: 'rep-3a', name: 'FEC por Região Bahia.pdf', date: '2024-12-10', size: '2.2 MB' },
                      { id: 'rep-3b', name: 'Análise FEC vs Meta ANEEL.pdf', date: '2024-12-05', size: '1.6 MB' },
                    ],
                  },
                ],
              },
              {
                id: 'proj-reducao-perdas',
                name: 'Redução de Perdas Técnicas',
                description: 'Programa de combate às perdas técnicas',
                indicators: [
                  {
                    id: 'ind-perdas',
                    name: 'Índice de Perdas Técnicas',
                    value: '6.8',
                    unit: '%',
                    trend: 'down',
                    reports: [
                      { id: 'rep-4', name: 'Relatório Perdas Técnicas 2024.pdf', date: '2024-12-01', size: '3.2 MB' },
                      { id: 'rep-4a', name: 'Mapeamento Perdas por Alimentador.pdf', date: '2024-11-25', size: '4.8 MB' },
                      { id: 'rep-4b', name: 'Investimentos Redução Perdas.pdf', date: '2024-11-20', size: '2.3 MB' },
                      { id: 'rep-4c', name: 'Benchmark Perdas Técnicas Brasil.pdf', date: '2024-11-15', size: '1.9 MB' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'ger-atendimento',
            name: 'Gerência de Atendimento',
            projects: [
              {
                id: 'proj-call-center',
                name: 'Melhoria Call Center',
                description: 'Otimização do atendimento telefônico',
                indicators: [
                  {
                    id: 'ind-tma',
                    name: 'TMA - Tempo Médio de Atendimento',
                    value: '180',
                    unit: 'segundos',
                    trend: 'down',
                    reports: [
                      { id: 'rep-6', name: 'Dashboard Call Center.pdf', date: '2024-12-18', size: '1.5 MB' },
                      { id: 'rep-6a', name: 'TMA por Tipo de Chamada.pdf', date: '2024-12-15', size: '1.8 MB' },
                      { id: 'rep-6b', name: 'Relatório Produtividade Agentes.pdf', date: '2024-12-12', size: '2.4 MB' },
                      { id: 'rep-6c', name: 'Análise Picos de Demanda.pdf', date: '2024-12-10', size: '1.3 MB' },
                    ],
                  },
                ],
              },
            ],
          }],
      }

    
    ],
  },
  {
    id: 'cosern',
    name: 'Cosern',
    fullName: 'Neoenergia Cosern',
    superintendences: [
      {
        id: 'sup-operacoes-rn',
        name: 'Superintendência de Operações',
        managements: [
          {
            id: 'ger-distribuicao-rn',
            name: 'Gerência de Distribuição',
            projects: [
              {
                id: 'proj-expansao-rn',
                name: 'Expansão da Rede',
                description: 'Ampliação da cobertura de distribuição',
                indicators: [
                  {
                    id: 'ind-cobertura',
                    name: 'Índice de Cobertura',
                    value: '98.2',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-7', name: 'Relatório Expansão 2024.pdf', date: '2024-12-05', size: '2.8 MB' },
                      { id: 'rep-7a', name: 'Mapa Cobertura RN 2024.pdf', date: '2024-12-01', size: '6.2 MB' },
                      { id: 'rep-7b', name: 'Plano Expansão 2025-2027.pdf', date: '2024-11-28', size: '3.9 MB' },
                      { id: 'rep-7c', name: 'Investimentos Infraestrutura.pdf', date: '2024-11-20', size: '2.5 MB' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'brasilia',
    name: 'Neoenergia Brasília',
    fullName: 'Neoenergia Brasília',
    superintendences: [
      {
        id: 'sup-operacoes-df',
        name: 'Superintendência de Operações',
        managements: [
          {
            id: 'ger-tecnica-df',
            name: 'Gerência Técnica',
            projects: [
              {
                id: 'proj-smart-grid',
                name: 'Smart Grid',
                description: 'Implementação de redes inteligentes',
                indicators: [
                  {
                    id: 'ind-automacao',
                    name: 'Nível de Automação',
                    value: '45',
                    unit: '%',
                    trend: 'up',
                    reports: [
                      { id: 'rep-8', name: 'Projeto Smart Grid.pdf', date: '2024-11-28', size: '5.2 MB' },
                      { id: 'rep-8a', name: 'Arquitetura Smart Grid DF.pdf', date: '2024-11-25', size: '4.1 MB' },
                      { id: 'rep-8b', name: 'ROI Automação de Rede.pdf', date: '2024-11-20', size: '2.3 MB' },
                      { id: 'rep-8c', name: 'Cronograma Implantação 2025.pdf', date: '2024-11-15', size: '1.8 MB' },
                      { id: 'rep-8d', name: 'Estudo Viabilidade Técnica.pdf', date: '2024-11-10', size: '3.6 MB' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'elektro',
    name: 'Elektro',
    fullName: 'Neoenergia Elektro',
    superintendences: [
      {
        id: 'sup-operacoes-sp',
        name: 'Superintendência de Operações',
        managements: [
          {
            id: 'ger-manutencao-sp',
            name: 'Gerência de Manutenção',
            projects: [
              {
                id: 'proj-preventiva',
                name: 'Manutenção Preventiva',
                description: 'Programa de manutenção preventiva',
                indicators: [
                  {
                    id: 'ind-disponibilidade',
                    name: 'Disponibilidade da Rede',
                    value: '99.7',
                    unit: '%',
                    trend: 'stable',
                    reports: [
                      { id: 'rep-9', name: 'Manutenção Preventiva 2024.pdf', date: '2024-12-12', size: '3.4 MB' },
                      { id: 'rep-9a', name: 'Calendário Manutenções 2025.pdf', date: '2024-12-10', size: '1.9 MB' },
                      { id: 'rep-9b', name: 'Indicadores MTBF MTTR.pdf', date: '2024-12-05', size: '2.1 MB' },
                      { id: 'rep-9c', name: 'Análise Falhas Recorrentes.pdf', date: '2024-12-01', size: '2.8 MB' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pernambuco',
    name: 'Neoenergia Pernambuco',
    fullName: 'Neoenergia Pernambuco',
    superintendences: [
      {
        id: 'sup-operacoes-pe',
        name: 'Superintendência de Operações',
        managements: [
          {
            id: 'ger-projetos-pe',
            name: 'Gerência de Projetos',
            projects: [
              {
                id: 'proj-energia-solar',
                name: 'Energia Solar Distribuída',
                description: 'Integração de geração solar',
                indicators: [
                  {
                    id: 'ind-gd',
                    name: 'Conexões GD',
                    value: '15420',
                    unit: 'unidades',
                    trend: 'up',
                    reports: [
                      { id: 'rep-10', name: 'Relatório GD 2024.pdf', date: '2024-12-08', size: '2.1 MB' },
                      { id: 'rep-10a', name: 'Mapa Solar Pernambuco.pdf', date: '2024-12-05', size: '7.3 MB' },
                      { id: 'rep-10b', name: 'Análise Impacto Rede GD.pdf', date: '2024-12-01', size: '3.2 MB' },
                      { id: 'rep-10c', name: 'Projeção Conexões 2025.pdf', date: '2024-11-28', size: '1.8 MB' },
                      { id: 'rep-10d', name: 'Regulamentação ANEEL GD.pdf', date: '2024-11-20', size: '2.4 MB' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
];

// Helper function to get all searchable items
export interface SearchResult {
  type: 'indicator' | 'report';
  path: string[];
  indicator?: Indicator;
  report?: PdfReport;
  companyId: string;
  superintendenceId: string;
  managementId: string;
  projectId: string;
}

export function searchIndicators(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  companies.forEach((company) => {
    company.superintendences.forEach((sup) => {
      sup.managements.forEach((mgmt) => {
        mgmt.projects.forEach((proj) => {
          proj.indicators.forEach((ind) => {
            const path = [company.name, sup.name, mgmt.name, proj.name];
            
            // Search in indicator name
            if (ind.name.toLowerCase().includes(lowerQuery)) {
              results.push({
                type: 'indicator',
                path: [...path, ind.name],
                indicator: ind,
                companyId: company.id,
                superintendenceId: sup.id,
                managementId: mgmt.id,
                projectId: proj.id,
              });
            }

            // Search in reports
            ind.reports.forEach((report) => {
              if (report.name.toLowerCase().includes(lowerQuery)) {
                results.push({
                  type: 'report',
                  path: [...path, ind.name, report.name],
                  report,
                  indicator: ind,
                  companyId: company.id,
                  superintendenceId: sup.id,
                  managementId: mgmt.id,
                  projectId: proj.id,
                });
              }
            });
          });
        });
      });
    });
  });

  return results;
}
