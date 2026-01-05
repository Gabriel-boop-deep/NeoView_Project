import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// All searchable indicators and their keywords for semantic matching
const indicatorsData = [
  {
    id: "ind-dec",
    name: "DEC - Duração Equivalente por Consumidor",
    keywords: ["duração", "interrupção", "queda", "falta de luz", "sem energia", "demora", "tempo sem luz"],
    companyId: "coelba",
    superintendenceId: "sup-operacoes-ba",
    managementId: "ger-manutencao",
    projectId: "proj-eficiencia-rede",
    path: ["Coelba", "Superintendência de Operações", "Gerência de Manutenção", "Eficiência de Rede", "DEC - Duração Equivalente por Consumidor"],
  },
  {
    id: "ind-fec",
    name: "FEC - Frequência Equivalente por Consumidor",
    keywords: ["frequência", "interrupção", "vezes", "quantas vezes", "quedas", "apagão"],
    companyId: "coelba",
    superintendenceId: "sup-operacoes-ba",
    managementId: "ger-manutencao",
    projectId: "proj-eficiencia-rede",
    path: ["Coelba", "Superintendência de Operações", "Gerência de Manutenção", "Eficiência de Rede", "FEC - Frequência Equivalente por Consumidor"],
  },
  {
    id: "ind-perdas",
    name: "Índice de Perdas Técnicas",
    keywords: ["perdas", "desperdício", "eficiência", "técnicas", "energia perdida"],
    companyId: "coelba",
    superintendenceId: "sup-operacoes-ba",
    managementId: "ger-manutencao",
    projectId: "proj-reducao-perdas",
    path: ["Coelba", "Superintendência de Operações", "Gerência de Manutenção", "Redução de Perdas Técnicas", "Índice de Perdas Técnicas"],
  },
  {
    id: "ind-isqp",
    name: "ISQP - Índice de Satisfação",
    keywords: ["satisfação", "cliente", "consumidor", "feliz", "contente", "qualidade", "atendimento", "nota", "avaliação", "pesquisa", "opinião", "feedback"],
    companyId: "coelba",
    superintendenceId: "sup-operacoes-ba",
    managementId: "ger-qualidade",
    projectId: "proj-satisfacao",
    path: ["Coelba", "Superintendência de Operações", "Gerência de Qualidade", "Satisfação do Cliente", "ISQP - Índice de Satisfação"],
  },
  {
    id: "ind-tma",
    name: "TMA - Tempo Médio de Atendimento",
    keywords: ["atendimento", "call center", "telefone", "tempo", "espera", "ligação", "chamada"],
    companyId: "coelba",
    superintendenceId: "sup-comercial-ba",
    managementId: "ger-atendimento",
    projectId: "proj-call-center",
    path: ["Coelba", "Superintendência Comercial", "Gerência de Atendimento", "Melhoria Call Center", "TMA - Tempo Médio de Atendimento"],
  },
  {
    id: "ind-cobertura",
    name: "Índice de Cobertura",
    keywords: ["cobertura", "expansão", "rede", "alcance", "área", "abrangência"],
    companyId: "cosern",
    superintendenceId: "sup-operacoes-rn",
    managementId: "ger-distribuicao-rn",
    projectId: "proj-expansao-rn",
    path: ["Cosern", "Superintendência de Operações", "Gerência de Distribuição", "Expansão da Rede", "Índice de Cobertura"],
  },
  {
    id: "ind-automacao",
    name: "Nível de Automação",
    keywords: ["automação", "smart grid", "inteligente", "tecnologia", "modernização", "digital"],
    companyId: "brasilia",
    superintendenceId: "sup-operacoes-df",
    managementId: "ger-tecnica-df",
    projectId: "proj-smart-grid",
    path: ["Neoenergia Brasília", "Superintendência de Operações", "Gerência Técnica", "Smart Grid", "Nível de Automação"],
  },
  {
    id: "ind-disponibilidade",
    name: "Disponibilidade da Rede",
    keywords: ["disponibilidade", "manutenção", "preventiva", "rede", "funcionamento", "operação"],
    companyId: "elektro",
    superintendenceId: "sup-operacoes-sp",
    managementId: "ger-manutencao-sp",
    projectId: "proj-preventiva",
    path: ["Elektro", "Superintendência de Operações", "Gerência de Manutenção", "Manutenção Preventiva", "Disponibilidade da Rede"],
  },
  {
    id: "ind-gd",
    name: "Conexões GD",
    keywords: ["solar", "geração distribuída", "energia solar", "renovável", "painéis", "fotovoltaico"],
    companyId: "pernambuco",
    superintendenceId: "sup-operacoes-pe",
    managementId: "ger-projetos-pe",
    projectId: "proj-energia-solar",
    path: ["Neoenergia Pernambuco", "Superintendência de Operações", "Gerência de Projetos", "Energia Solar Distribuída", "Conexões GD"],
  },
  {
    id: "ind-sinergia",
    name: "Índice de Sinergia",
    keywords: ["sinergia", "integração", "unificação", "processos", "estratégia", "planejamento"],
    companyId: "distribuicao",
    superintendenceId: "sup-planejamento",
    managementId: "ger-estrategia",
    projectId: "proj-integracao",
    path: ["Neoenergia Distribuição", "Superintendência de Planejamento", "Gerência de Estratégia", "Integração Operacional", "Índice de Sinergia"],
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const indicatorsList = indicatorsData.map(i => `- ${i.name} (keywords: ${i.keywords.join(", ")})`).join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um assistente de busca semântica para um sistema de indicadores de empresas de energia elétrica.
Dado uma consulta do usuário em linguagem natural, retorne os IDs dos indicadores mais relevantes.

Indicadores disponíveis:
${indicatorsList}

IMPORTANTE: 
- Entenda a intenção do usuário mesmo que ele não use termos exatos
- "satisfação" deve retornar indicadores de satisfação do cliente
- "queda de luz" deve retornar indicadores de DEC/FEC
- Retorne apenas os IDs separados por vírgula, sem explicação
- Retorne no máximo 5 indicadores mais relevantes
- Se não encontrar nada relevante, retorne "none"`,
          },
          {
            role: "user",
            content: query,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content?.trim() || "none";
    
    // Parse the AI response to get indicator IDs
    const indicatorIds = aiResponse.toLowerCase() === "none" 
      ? [] 
      : aiResponse.split(",").map((id: string) => id.trim());

    // Filter indicators based on AI response
    const results = indicatorsData.filter(ind => 
      indicatorIds.some((id: string) => ind.id.includes(id) || id.includes(ind.id))
    );

    return new Response(JSON.stringify({ results, aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI search error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
