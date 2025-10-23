'use client';

import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  type: 'block' | 'transaction' | 'address' | 'subnet';
  value: string;
  label: string;
}

export function SearchBar({
  placeholder = 'Search by address, tx hash, or block...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Detect search type
  const detectType = (value: string): 'block' | 'transaction' | 'address' | 'subnet' => {
    if (value.startsWith('0x')) {
      if (value.length === 66 || value.includes('...')) return 'transaction';
      if (value.length === 42 || value.includes('...')) return 'address';
    } else if (!isNaN(Number(value))) {
      return 'block';
    }
    return 'subnet';
  };

  // Handle search
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    const type = detectType(searchQuery);
    
    // Route based on type
    if (type === 'transaction' || type === 'address' || type === 'block') {
      router.push(`/explorer/${searchQuery}`);
    } else {
      router.push(`/explorer?q=${searchQuery}`);
    }

    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSearch(suggestions[selectedIndex].value);
    } else {
      handleSearch();
    }
  };

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Mock suggestions - replace with actual API call
    const mockSuggestions: SearchSuggestion[] = [];
    
    // If looks like a block number
    if (!isNaN(Number(query)) && query.length > 0) {
      mockSuggestions.push({
        type: 'block',
        value: query,
        label: `Block #${query}`,
      });
    }

    // If starts with 0x
    if (query.startsWith('0x')) {
      if (query.length >= 10) {
        mockSuggestions.push({
          type: query.length > 42 ? 'transaction' : 'address',
          value: query,
          label: query.length > 42 ? `Transaction ${query}` : `Address ${query}`,
        });
      }
    }

    // Add recent searches from localStorage
    try {
      const recent = localStorage.getItem('recentSearches');
      if (recent) {
        const recentSearches: string[] = JSON.parse(recent);
        recentSearches
          .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
          .forEach((search) => {
            mockSuggestions.push({
              type: detectType(search),
              value: search,
              label: `Recent: ${search}`,
            });
          });
      }
    } catch (e) {
      // Ignore localStorage errors
    }

    setSuggestions(mockSuggestions.slice(0, 5));
    setShowSuggestions(mockSuggestions.length > 0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save to recent searches
  const saveToRecent = (value: string) => {
    try {
      const recent = localStorage.getItem('recentSearches');
      const searches: string[] = recent ? JSON.parse(recent) : [];
      const updated = [value, ...searches.filter((s) => s !== value)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      block: '▣',
      transaction: '⟲',
      address: '⬡',
      subnet: '⊞',
      unknown: '?',
    };
    return icons[type as keyof typeof icons] || icons.unknown;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <form onSubmit={onSubmit}>
        <div className="relative font-mono">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 glass-panel text-white text-xs placeholder-gray-500 focus:outline-none focus:border-white transition-all relative z-10"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel border border-white/20 overflow-hidden z-50"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                type="button"
                onClick={() => {
                  saveToRecent(suggestion.value);
                  handleSearch(suggestion.value);
                }}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors font-mono ${
                  index === selectedIndex
                    ? 'bg-primary-gold text-black'
                    : 'hover:bg-white/5 text-white'
                }`}
              >
                <span className="text-primary-gold text-sm">
                  {getTypeIcon(suggestion.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase text-gray-400">
                    {suggestion.type}
                  </p>
                  <p className="text-xs truncate">
                    {suggestion.label}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

