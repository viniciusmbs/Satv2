import React from 'react';
import { ExternalLink } from 'lucide-react';

interface HeaderProps {
  totalChannels: number;
}

const Header: React.FC<HeaderProps> = ({ totalChannels }) => {
  return (
    <header className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white shadow-xl sticky top-0 z-40 border-b border-red-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <img
                src="https://i.imgur.com/VWtF2t5.jpeg"
                alt="SATV Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/80 shadow-md object-cover bg-black"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="sr-only">SATV</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-[#991b1b] text-xs font-black px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                  SATV
                </span>
                <h1 className="text-sm sm:text-base font-bold tracking-wide text-white drop-shadow-sm truncate">
                  SATV - Vinicius Mendes ®
                </h1>
              </div>
              <p className="text-[11px] text-red-200/90 hidden sm:block">
                Web IPTV &bull; {totalChannels} Canais Disponíveis
              </p>
            </div>
          </div>

          {/* Clean Indicator for Direct Tab Opening */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/40 text-red-100 border border-white/15 shadow-sm">
              <ExternalLink className="w-3 h-3 text-red-300" />
              <span>Abertura Direta em Nova Aba</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
