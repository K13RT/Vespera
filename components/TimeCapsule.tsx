import React from 'react';
import { History, ArrowRight } from 'lucide-react';

const TimeCapsule: React.FC = () => {
  return (
    <div className="relative h-full w-full rounded-3xl shadow-lg overflow-hidden group cursor-pointer">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('https://picsum.photos/seed/mem/600/300')` }}
      />
      <div className="absolute inset-0 bg-vespera-accent/80 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div className="flex items-center gap-2 text-white/80">
          <History size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Time Capsule</span>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-1">On this day, 1 year ago</p>
          <p className="font-serif italic text-lg leading-snug line-clamp-2 text-white/95">
            "The rain stopped just in time for the sunset. It was a purple sky, much like today..."
          </p>
        </div>

        <div className="flex justify-end">
            <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span>Open Memory</span>
                <ArrowRight size={14} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default TimeCapsule;
