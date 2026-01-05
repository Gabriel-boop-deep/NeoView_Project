import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, TrendingUp, ChevronRight } from 'lucide-react';
import { searchIndicators, SearchResult } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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
    if (value.length >= 2) {
      const searchResults = searchIndicators(value);
      setResults(searchResults.slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/dashboard?company=${result.companyId}&sup=${result.superintendenceId}&mgmt=${result.managementId}&proj=${result.projectId}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Buscar relatórios e indicadores..."
          className="search-input pl-12 pr-4"
        />
      </div>

      {isOpen && results.length > 0 && (
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

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border shadow-lg p-4 text-center text-muted-foreground z-50">
          Nenhum resultado encontrado para "{query}"
        </div>
      )}
    </div>
  );
};
