/**
 * ============================================================
 * COMPONENT: ReportCard
 * ============================================================
 * 
 * Card de relatório com métricas interativas (view, comment, like, share).
 * Cada clique incrementa o contador localmente.
 * ============================================================
 */

import React, { useState } from 'react';
import { FileText, Eye, MessageCircle, Heart, Share2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PdfReport, ReportMetrics } from '@/data/mockData';

interface ReportCardProps {
  report: PdfReport;
  onMetricsChange?: (reportId: string, metrics: ReportMetrics) => void;
  className?: string;
}

export function ReportCard({ report, onMetricsChange, className }: ReportCardProps) {
  const [metrics, setMetrics] = useState<ReportMetrics>(report.metrics);
  const [liked, setLiked] = useState(false);

  const handleMetricClick = (type: keyof ReportMetrics, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newMetrics = { ...metrics };
    
    if (type === 'likes') {
      if (!liked) {
        newMetrics.likes += 1;
        setLiked(true);
      } else {
        newMetrics.likes = Math.max(0, newMetrics.likes - 1);
        setLiked(false);
      }
    } else {
      newMetrics[type] += 1;
    }
    
    setMetrics(newMetrics);
    onMetricsChange?.(report.id, newMetrics);
  };

  const handleOpenReport = () => {
    // Incrementa views ao abrir
    const newMetrics = { ...metrics, views: metrics.views + 1 };
    setMetrics(newMetrics);
    onMetricsChange?.(report.id, newMetrics);
    
    // Abre o relatório (placeholder URL)
    window.open(report.url || '#', '_blank');
  };

  return (
    <div
      className={cn(
        'group bg-card border border-border rounded-lg p-4 hover:shadow-card-hover transition-all duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <button
            onClick={handleOpenReport}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left line-clamp-2 flex items-center gap-1"
          >
            {report.name}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="text-xs text-muted-foreground mt-1">{report.date} • {report.size}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
        {report.description}
      </p>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <button
          onClick={(e) => handleMetricClick('views', e)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors group/btn"
        >
          <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary" />
          <span className="text-xs text-muted-foreground group-hover/btn:text-foreground">{metrics.views}</span>
        </button>

        <button
          onClick={(e) => handleMetricClick('comments', e)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors group/btn"
        >
          <MessageCircle className="w-4 h-4 text-muted-foreground group-hover/btn:text-secondary" />
          <span className="text-xs text-muted-foreground group-hover/btn:text-foreground">{metrics.comments}</span>
        </button>

        <button
          onClick={(e) => handleMetricClick('likes', e)}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors group/btn',
            liked ? 'bg-destructive/10' : 'hover:bg-muted'
          )}
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors',
              liked ? 'text-destructive fill-destructive' : 'text-muted-foreground group-hover/btn:text-destructive'
            )}
          />
          <span className={cn(
            'text-xs transition-colors',
            liked ? 'text-destructive' : 'text-muted-foreground group-hover/btn:text-foreground'
          )}>
            {metrics.likes}
          </span>
        </button>

        <button
          onClick={(e) => handleMetricClick('shares', e)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors group/btn"
        >
          <Share2 className="w-4 h-4 text-muted-foreground group-hover/btn:text-accent" />
          <span className="text-xs text-muted-foreground group-hover/btn:text-foreground">{metrics.shares}</span>
        </button>
      </div>
    </div>
  );
}

export default ReportCard;
