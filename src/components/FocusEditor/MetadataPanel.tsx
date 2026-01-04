import React from 'react';
import { Cloud, MapPin, Music } from 'lucide-react';
import { WEATHER_OPTIONS } from './types';

interface MetadataPanelProps {
  weather: string;
  impressivePlace: string;
  songName: string;
  onWeatherChange: (weather: string) => void;
  onPlaceChange: (place: string) => void;
  onSongChange: (song: string) => void;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
  weather,
  impressivePlace,
  songName,
  onWeatherChange,
  onPlaceChange,
  onSongChange
}) => {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Weather Select */}
        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl min-w-[140px] flex-1 border border-transparent focus-within:border-vespera-accent/30 transition-colors">
          <Cloud size={16} className="text-blue-400 shrink-0" />
          <select 
            value={weather} 
            onChange={(e) => onWeatherChange(e.target.value)}
            className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full outline-none text-gray-700 dark:text-gray-200"
          >
            {WEATHER_OPTIONS.map(w => (
              <option key={w} value={w} className="bg-white dark:bg-[#151525]">{w}</option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl min-w-[140px] flex-1 border border-transparent focus-within:border-vespera-accent/30 transition-colors">
          <MapPin size={16} className="text-purple-400 shrink-0" />
          <input 
            type="text" 
            value={impressivePlace} 
            onChange={(e) => onPlaceChange(e.target.value)}
            placeholder="Thêm địa điểm..."
            className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
          />
        </div>
      </div>
      
      {/* Song Input */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl flex-[2] border border-transparent focus-within:border-vespera-accent/30 transition-colors">
          <Music size={16} className="text-pink-400 shrink-0" />
          <input 
            type="text" 
            value={songName} 
            onChange={(e) => onSongChange(e.target.value)}
            placeholder="Bạn đang nghe bài gì?"
            className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MetadataPanel);
