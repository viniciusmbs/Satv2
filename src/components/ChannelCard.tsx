import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Channel } from '../types';
import { getChannelLogo } from '../data/channelLogos';

interface ChannelCardProps {
  channel: Channel;
  index: number;
  onSelect?: (channel: Channel) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  index,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);

  // Fallback to official high-quality logo mapping
  const fallbackLogo = getChannelLogo(channel.name);
  const logoSrc = imgError || !channel.logo ? fallbackLogo : channel.logo;

  const handleOpenChannel = () => {
    window.open(channel.url, '_blank', 'noopener,noreferrer');
    if (onSelect) {
      onSelect(channel);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Standard Enter (13), Space (32), Android DPAD_CENTER (23), and Android KEYCODE_ENTER (66)
    const isActivationKey =
      e.key === 'Enter' ||
      e.key === ' ' ||
      e.keyCode === 13 ||
      e.keyCode === 23 ||
      e.keyCode === 66;

    if (isActivationKey) {
      e.preventDefault();
      handleOpenChannel();
    }
  };

  return (
    <a
      id={`channel-card-${channel.id || encodeURIComponent(channel.name)}`}
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={0}
      role="button"
      aria-label={`Canal ${channel.name} - Abrir em nova aba`}
      data-tv-card="true"
      data-channel-name={channel.name}
      data-channel-index={index}
      onClick={(e) => {
        e.preventDefault();
        handleOpenChannel();
      }}
      onKeyDown={handleKeyDown}
      className="group tv-card-focus relative bg-[#151c2c] hover:bg-[#1e2738] focus:bg-[#1e2738] border border-slate-700/60 hover:border-red-500 focus:border-red-500 rounded-xl p-3 flex flex-col items-center justify-between text-center transition-all duration-150 cursor-pointer outline-none select-none shadow-md"
    >
      {/* Top Header: Channel Index Number & Simple 'Nova Aba' Indicator */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2 px-0.5">
        <span className="font-mono font-bold bg-slate-800/90 text-slate-200 px-2 py-0.5 rounded border border-slate-700/70">
          #{index + 1}
        </span>
        <span className="text-slate-400 group-hover:text-red-400 group-focus:text-red-400 transition-colors flex items-center gap-1 font-medium text-[10px]">
          <span>Aba</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>

      {/* Clean Channel Logo Box */}
      <div className="relative w-full h-16 sm:h-20 flex items-center justify-center p-2 bg-slate-900/90 rounded-lg overflow-hidden mb-2 border border-slate-800 group-hover:border-slate-700 group-focus:border-red-500/50 transition">
        <img
          src={logoSrc}
          alt={`${channel.name} logo`}
          className="max-w-full max-h-full object-contain transition-transform duration-150 group-hover:scale-105 group-focus:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Channel Name */}
      <p
        className="text-gray-100 text-xs sm:text-sm font-bold line-clamp-2 w-full leading-snug group-hover:text-red-400 group-focus:text-red-400 transition-colors"
        title={channel.name}
      >
        {channel.name}
      </p>

      {/* Category Group Label */}
      <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full font-medium">
        {channel.group}
      </span>
    </a>
  );
};

export default ChannelCard;
