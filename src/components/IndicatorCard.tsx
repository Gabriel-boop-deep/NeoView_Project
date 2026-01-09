
import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageSquare,
  Eye,
} from 'lucide-react';

import { Indicator } from '@/data/mockData';

interface IndicatorCardProps {
  indicator: Indicator;
  highlighted?: boolean;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, highlighted }) => {
  const [isExpanded, setIsExpanded] = useState(highlighted || false);

  // Estados locais para os mini botões
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(indicator.likes ?? 0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [views, setViews] = useState<number>(indicator.views ?? 0);

  // Exemplo: incrementar visualizações quando o card é expandido
  useEffect(() => {
    if (isExpanded) {
      setViews((v) => v + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // evita abrir/fechar o card
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => c + (next ? 1 : -1));
      return next;
    });
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // evita abrir/fechar o card
    setShowComments((prev) => !prev);
  };

  const trendIcons = {
    up: <TrendingUp className="w-5 h-5 text-primary" />,
    down: <TrendingDown className="w-5 h-5 text-destructive" />,
    stable: <Minus className="w-5 h-5 text-muted-foreground" />,
  };

  const trendColors = {
    up: 'bg-primary/10 text-primary',
    down: 'bg-destructive/10 text-destructive',
    stable: 'bg-muted text-muted-foreground',
  };

  return (
    <div
      className={`bg-card rounded-xl border transition-all duration-300 ${
        highlighted ? 'border-primary shadow-card-hover ring-2 ring-primary/20' : 'border-border shadow-card'
      }`}
    >
      {/* Cabeçalho clicável para expandir */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${trendColors[indicator.trend]}`}>
            {trendIcons[indicator.trend]}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{indicator.name}</h4>
            <p className="text-2xl font-bold text-primary mt-1">
              {indicator.value}{' '}
              <span className="text-sm font-normal text-muted-foreground">{indicator.unit}</span>
            </p>
          </div>
        </div>

        {/* Direita do cabeçalho: contagem de relatórios + mini ações */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {indicator.reports.length} {indicator.reports.length === 1 ? 'relatório' : 'relatórios'}
          </span>

          {/* Barra de mini ações */}
          <div className="ml-2 flex items-center gap-2">
            {/* Curtir */}
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                liked ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              } hover:bg-primary/10 hover:text-primary`}
              aria-pressed={liked}
              aria-label={liked ? 'Remover curtida do indicador' : 'Curtir indicador'}
              title={liked ? 'Você curtiu' : 'Curtir'}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likeCount}</span>
            </button>

            {/* Comentários */}
            <button
              onClick={handleCommentsClick}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-colors"
              aria-expanded={showComments}
              aria-label="Abrir comentários do indicador"
              title="Comentários"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{indicator.commentsCount ?? indicator.comments?.length ?? 0}</span>
            </button>

            {/* Visualizações (somente leitura local) */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
              title="Visualizações"
              aria-label="Visualizações do indicador"
            >
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
          </div>

          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Área opcional de comentários (abre independente da área de relatórios) */}
      {showComments && (
        <div className="px-5 pb-4 border-t border-border pt-4 animate-fade-in">
          <h5 className="text-sm font-medium text-muted-foreground mb-3">Comentários</h5>

          {indicator.comments?.length ? (
            <div className="space-y-2">
              {indicator.comments.map((c) => (
                <div key={c.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-foreground">{c.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {c.author} • {c.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Seja o primeiro a comentar.</p>
          )}
        </div>
      )}

      {/* Área de relatórios PDF (controlada por isExpanded) */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-border pt-4 animate-fade-in">
          <h5 className="text-sm font-medium text-muted-foreground mb-3">Relatórios PDF</h5>
          <div className="space-y-2">
            {indicator.reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: implemente o download real (ex: window.open(report.url))
                  }}
                >
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
