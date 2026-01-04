import React, { useState } from 'react';
import { Cloud, MapPin, Music, X } from 'lucide-react';
import { WEATHER_OPTIONS } from './types';

interface MetadataPanelProps {
  weather: string;
  locations: string[];
  songName: string;
  availableLocations?: string[];
  onWeatherChange: (weather: string) => void;
  onLocationsChange: (locations: string[]) => void;
  onSongChange: (song: string) => void;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
  weather,
  locations,
  songName,
  availableLocations = [],
  onWeatherChange,
  onLocationsChange,
  onSongChange
}) => {
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');

  const suggestedLocations = availableLocations.filter(
    place => place.toLowerCase().includes(currentLocation.toLowerCase()) && !locations.includes(place)
  );

  const handleAddLocation = (place: string) => {
    if (place.trim() && !locations.includes(place.trim())) {
        onLocationsChange([...locations, place.trim()]);
        setCurrentLocation('');
        setShowLocationSuggestions(false);
    }
  };

  const handleRemoveLocation = (placeToRemove: string) => {
      onLocationsChange(locations.filter(l => l !== placeToRemove));
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLocation(currentLocation);
    }
  };

  const handleLocationBlur = () => {
    setTimeout(() => {
        setShowLocationSuggestions(false);
    }, 200);
  };

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
        <div className="relative flex-1 min-w-[140px]">
             {/* Suggestions Dropdown */}
            {showLocationSuggestions && currentLocation && suggestedLocations.length > 0 && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-[#1A1A2E] border border-gray-100 dark:border-white/10 rounded-lg shadow-xl overflow-hidden max-h-32 overflow-y-auto z-50">
                {suggestedLocations.map(place => (
                    <div 
                    key={place} 
                    className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/10 text-xs cursor-pointer text-gray-600 dark:text-gray-300" 
                    onMouseDown={(e) => { e.preventDefault(); handleAddLocation(place); }}
                    >
                    {place}
                    </div>
                ))}
                </div>
            )}

            <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-white/5 rounded-xl w-full border border-transparent focus-within:border-vespera-accent/30 transition-colors flex-wrap">
                <MapPin size={16} className="text-purple-400 shrink-0" />
                
                {/* Render Selected Locations as Tags */}
                {locations.map(loc => (
                    <span key={loc} className="animate-fade-in px-2 py-0.5 rounded-lg bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/40 dark:to-purple-900/20 text-purple-700 dark:text-purple-200 text-[10px] font-semibold flex items-center gap-1 shadow-sm border border-purple-100 dark:border-purple-800/30 select-none whitespace-nowrap">
                        {loc}
                        <button
                            onClick={() => handleRemoveLocation(loc)}
                            className="p-0.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-400 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200 transition-colors"
                        >
                            <X size={10} />
                        </button>
                    </span>
                ))}

                <input 
                    type="text" 
                    value={currentLocation} 
                    onChange={(e) => { setCurrentLocation(e.target.value); setShowLocationSuggestions(true); }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={handleLocationBlur}
                    onKeyDown={handleLocationKeyDown}
                    placeholder={locations.length === 0 ? "Thêm địa điểm..." : ""}
                    className="bg-transparent border-none p-0 text-xs focus:ring-0 min-w-[80px] flex-1 outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                />
            </div>
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
