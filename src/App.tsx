import React, { useState, useEffect, useMemo } from 'react';
import type { Channel, GroupedChannels } from './types';
import { parseM3U } from './services/m3uParser';
import { m3uPlaylist } from './data/playlist';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ChannelGrid from './components/ChannelGrid';
import { useTvNavigation } from './services/useTvNavigation';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Load initial playlist
  useEffect(() => {
    try {
      const parsed = parseM3U(m3uPlaylist);
      setChannels(parsed);
    } catch (err) {
      console.error('Falha ao carregar playlist inicial:', err);
    }
  }, []);

  // Distinct categories from channels
  const categories = useMemo(() => {
    const cats = new Set<string>();
    channels.forEach((c) => {
      if (c.group) cats.add(c.group);
    });
    return Array.from(cats);
  }, [channels]);

  // Filter channels based on search and category
  const filteredChannels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return channels.filter((channel) => {
      // Category filter
      if (selectedCategory !== 'TODOS' && channel.group !== selectedCategory) {
        return false;
      }

      // Search query filter (matches channel name or group)
      if (q) {
        const nameMatch = channel.name.toLowerCase().includes(q);
        const groupMatch = channel.group.toLowerCase().includes(q);
        return nameMatch || groupMatch;
      }

      return true;
    });
  }, [channels, searchQuery, selectedCategory]);

  // Group filtered channels by group title
  const groupedChannels = useMemo(() => {
    const grouped: GroupedChannels = {};
    filteredChannels.forEach((ch) => {
      const g = ch.group || 'GERAL';
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(ch);
    });
    return grouped;
  }, [filteredChannels]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('TODOS');
  };

  // Active TV tabulation navigation hook
  const { lastFocusedCardRef } = useTvNavigation({ enabled: true });

  const handleSelectChannel = (ch: Channel) => {
    const cardEl = document.getElementById(`channel-card-${ch.id || encodeURIComponent(ch.name)}`);
    if (cardEl) {
      lastFocusedCardRef.current = cardEl;
    }
  };

  // Global D-Pad / remote shortcut: Press '/' or 's' to focus search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.key === '/' || e.key === 's') && document.activeElement?.tagName !== 'INPUT') {
        const searchInput = document.getElementById('channel-search-input');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Clean Minimal App Header */}
      <Header totalChannels={channels.length} />

      {/* Tabulated Search & Category Filter Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filteredCount={filteredChannels.length}
      />

      {/* Main Channel Grid with Direct New Tab Activation */}
      <main className="flex-1">
        <ChannelGrid
          groupedChannels={groupedChannels}
          onSelectChannel={handleSelectChannel}
          onClearFilters={handleClearFilters}
        />
      </main>

      {/* Clean TV Footer */}
      <footer className="bg-[#090d16] border-t border-slate-900 py-5 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">
          SATV &bull; Vinicius Mendes ® &copy; {new Date().getFullYear()}
        </p>
        <p className="text-[11px] text-slate-600">
          Otimizado para Android TV &bull; Fire TV Stick &bull; Tabulação Direta &bull; D-Pad &bull; Abertura em Nova Aba
        </p>
      </footer>
    </div>
  );
}
