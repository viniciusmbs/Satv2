import React from 'react';
import { Tv } from 'lucide-react';
import { Channel, GroupedChannels } from '../types';
import ChannelCard from './ChannelCard';

interface ChannelGridProps {
  groupedChannels: GroupedChannels;
  onSelectChannel: (channel: Channel) => void;
  onClearFilters: () => void;
}

const CATEGORY_ORDER: Record<string, number> = {
  'CANAL': 1,
  'DOCUMENTÁRIOS': 2,
  'FILMES & SÉRIES': 3,
  'FILMES E SÉRIES': 3,
  'VARIEDADES': 4,
  'ESPORTES': 5,
  'ESPN': 6,
  'PREMIERE': 7,
  'ESPORTES PPV': 8,
  'HBO': 9,
  'NOTÍCIAS': 10,
  'INFANTIS': 11,
  'MÚSICA': 12,
  'RELIGIOSOS': 13,
};

const ChannelGrid: React.FC<ChannelGridProps> = ({
  groupedChannels,
  onSelectChannel,
  onClearFilters,
}) => {
  const sortedGroupNames = Object.keys(groupedChannels).sort((a, b) => {
    const upperA = a.toUpperCase();
    const upperB = b.toUpperCase();

    const orderA = CATEGORY_ORDER[upperA] ?? 50;
    const orderB = CATEGORY_ORDER[upperB] ?? 50;

    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b, 'pt-BR');
  });

  if (sortedGroupNames.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500 border border-slate-700/60">
          <Tv className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-200 mb-1">
          Nenhum canal encontrado
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
          Tente buscar com outro nome de canal ou limpe os filtros de categoria.
        </p>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition shadow-md cursor-pointer"
        >
          Limpar Filtros e Ver Todos
        </button>
      </div>
    );
  }

  // Calculate continuous sequential index across all visible channels
  let globalIndex = 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {sortedGroupNames.map((groupName) => {
        const channels = groupedChannels[groupName];
        if (!channels || channels.length === 0) return null;

        return (
          <section key={groupName} className="space-y-3.5">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50" />
                <h2 className="text-sm sm:text-base font-bold text-gray-100 tracking-wide uppercase">
                  {groupName}
                </h2>
                <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/50">
                  {channels.length} canais
                </span>
              </div>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
              {channels.map((channel) => {
                const currentIndex = globalIndex++;
                return (
                  <ChannelCard
                    key={`${channel.name}-${channel.url}`}
                    channel={channel}
                    index={currentIndex}
                    onSelect={onSelectChannel}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ChannelGrid;
