import React from 'react';
import { MoodLevel } from '@/types';
import { MOOD_OPTIONS } from '@/constants';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Zap } from 'lucide-react';

interface MoodSelectorProps {
  selectedMood: MoodLevel | null;
  energyLevel: number;
  onMoodChange: (mood: MoodLevel) => void;
  onEnergyChange: (energy: number) => void;
}

export const getEnergyConfig = (level: number) => {
  if (level <= 20) return { label: 'Kiệt sức', color: 'text-red-400', bg: 'bg-red-400', icon: BatteryLow };
  if (level <= 40) return { label: 'Mệt mỏi', color: 'text-orange-400', bg: 'bg-orange-400', icon: BatteryMedium };
  if (level <= 60) return { label: 'Ổn', color: 'text-yellow-400', bg: 'bg-yellow-400', icon: BatteryMedium };
  if (level <= 85) return { label: 'Nhiều năng lượng', color: 'text-green-400', bg: 'bg-green-400', icon: BatteryFull };
  return { label: 'Sung sức', color: 'text-vespera-accent', bg: 'bg-vespera-accent', icon: Zap };
};

export const getMoodColor = (level: number) => {
  const option = MOOD_OPTIONS.find(o => o.level === level);
  return option ? option.color : 'text-gray-400';
};

export const getMoodLabel = (level: number) => {
  const option = MOOD_OPTIONS.find(o => o.level === level);
  return option ? option.label : 'Unknown';
};

export const getMoodIcon = (level: number) => {
  const option = MOOD_OPTIONS.find(o => o.level === level);
  return option ? option.icon : null;
};

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  energyLevel,
  onMoodChange,
  onEnergyChange
}) => {
  const energyConfig = getEnergyConfig(energyLevel);
  const EnergyIcon = energyConfig.icon;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mood Section */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          {MOOD_OPTIONS.map((option) => {
            const isSelected = selectedMood === option.level;
            return (
              <button
                key={option.level}
                onClick={() => onMoodChange(option.level)}
                className={`group relative transition-all duration-300 outline-none ${isSelected ? 'scale-110 -translate-y-1' : 'hover:-translate-y-1'}`}
              >
                <div className={`
                  p-3 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center
                  ${isSelected 
                    ? `bg-white dark:bg-white/10 shadow-lg ${option.color.replace('text-', 'shadow-')}/20 ring-1 ring-${option.color.replace('text-', '')}/30` 
                    : 'bg-gray-50 dark:bg-white/5 text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 grayscale hover:grayscale-0'
                  }
                `}>
                  <option.icon 
                    size={22} 
                    className={`transition-all duration-300 ${isSelected ? option.color + ' fill-current opacity-100' : 'text-gray-400 opacity-60 group-hover:opacity-100'}`} 
                    strokeWidth={isSelected ? 2.5 : 2}
                  />
                </div>
                {isSelected && (
                  <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold ${option.color} whitespace-nowrap`}>
                    {option.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Energy Section */}
      <div className="bg-gray-50/80 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 transition-all mt-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-gray-400">
            <EnergyIcon size={16} className={energyConfig.color} />
            <span className="text-xs font-bold uppercase tracking-wider">Năng lượng</span>
          </div>
          <span className={`text-sm font-bold transition-colors duration-300 ${energyConfig.color}`}>
            {energyConfig.label} <span className="text-gray-400 font-normal">({energyLevel}%)</span>
          </span>
        </div>
        
        <div className="relative h-6 flex items-center group">
          <div className="absolute inset-x-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-400 via-orange-400 to-green-400 transition-all duration-100 ease-linear"
              style={{ width: `${energyLevel}%` }}
            ></div>
          </div>
          <div 
            className="absolute h-5 w-5 bg-white shadow-md rounded-full border border-gray-100 cursor-grab active:cursor-grabbing transition-all duration-75 flex items-center justify-center hover:scale-110"
            style={{ left: `calc(${energyLevel}% - 10px)` }}
          >
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${energyConfig.bg}`}></div>
          </div>
          <input 
            type="range" min="0" max="100" 
            value={energyLevel}
            onChange={(e) => onEnergyChange(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MoodSelector);
