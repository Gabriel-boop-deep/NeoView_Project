import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, TrendingUp, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { searchIndicators, SearchResult } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AISearchResult {
  id: string;
  name: string;
  path: string[];
  companyId: string;
  superintendenceId: string;
  managementId: string;
  projectId: string;
}

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResults, setAiResults] = useState<AISearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [useAiSearch, setUseAiSearch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    setAiResults([]);
    
    if (value.length >= 2) {
      // Regular text search
      const searchResults = searchIndicators(value);
      setResults(searchResults.slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleAiSearch = async () => {
    if (query.length < 2) return;
    
    setIsAiSearching(true);
    setUseAiSearch(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query },
      });

      if (error) throw error;

      if (data?.results) {
        setAiResults(data.results);
        setResults([]);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult | AISearchResult) => {
    navigate(`/dashboard?company=${result.companyId}&sup=${result.superintendenceId}&mgmt=${result.managementId}&proj=${result.projectId}`);
    setIsOpen(false);
    setQuery('');
    setAiResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.length >= 2) {
      handleAiSearch();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar relatórios e indicadores... (Enter para IA)"
            className="search-input pl-12 pr-4"
          />
        </div>
        <button
          onClick={handleAiSearch}
          disabled={query.length < 2 || isAiSearching}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Busca inteligente com IA"
        >
          {isAiSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">IA</span>
        </button>
      </div>

      {isOpen && useAiSearch && aiResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="px-3 py-2 bg-primary/10 border-b border-border flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Resultados com IA</span>
          </div>
          <div className="p-2">
            {aiResults.map((result, index) => (
              <button
                key={`ai-${result.id}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="mt-0.5 p-2 rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{result.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 flex-wrap">
                    {result.path.slice(0, -1).map((segment, i) => (
                      <React.Fragment key={i}>
                        <span className="truncate max-w-[100px]">{segment}</span>
                        {i < result.path.length - 2 && (
                          <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && !useAiSearch && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className={`mt-0.5 p-2 rounded-lg ${result.type === 'indicator' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                  {result.type === 'indicator' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {result.type === 'indicator' ? result.indicator?.name : result.report?.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 flex-wrap">
                    {result.path.slice(0, -1).map((segment, i) => (
                      <React.Fragment key={i}>
                        <span className="truncate max-w-[100px]">{segment}</span>
                        {i < result.path.length - 2 && (
                          <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && aiResults.length === 0 && !isAiSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border shadow-lg p-4 text-center z-50">
          <p className="text-muted-foreground mb-2">Nenhum resultado encontrado para "{query}"</p>
          <button
            onClick={handleAiSearch}
            className="text-sm text-primary hover:underline flex items-center gap-1 justify-center mx-auto"
          >
            <Sparkles className="w-3 h-3" />
            Tentar busca inteligente com IA
          </button>
        </div>
      )}

      {isAiSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border shadow-lg p-4 text-center z-50">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Buscando com IA...</span>
          </div>
        </div>
      )}
    </div>
  );
};
