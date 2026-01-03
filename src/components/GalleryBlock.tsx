import React from 'react';
import { Plus } from 'lucide-react';
import { MOCK_GALLERY_IMAGES } from '../constants';

const GalleryBlock: React.FC = () => {
  // Slice to max 3 images to allow space for the Add button in a 2x2 grid
  const displayImages = MOCK_GALLERY_IMAGES.slice(0, 3);
  const totalCount = MOCK_GALLERY_IMAGES.length;

  return (
    <div className="h-full w-full rounded-3xl p-1 shadow-lg bg-white dark:bg-vespera-cardDark flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-500">
       {/* Header */}
       <div className="px-5 pt-4 pb-2 flex items-center justify-between shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Daily Gallery</h3>
        <div className="bg-purple-100 dark:bg-white/10 text-vespera-accent dark:text-purple-300 px-2 py-0.5 rounded-md text-[10px] font-bold min-w-[24px] text-center">
            {totalCount}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 p-3 pt-0 min-h-0">
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-3">
            {displayImages.map((src, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden cursor-pointer group/item shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                    <img 
                        src={src} 
                        alt="Gallery" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/item:scale-110" 
                    />
                    {/* Vignette/Gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                </div>
            ))}
            
            {/* Add Button Area */}
            <div className="relative rounded-2xl overflow-hidden">
                 <button className="absolute inset-0 w-full h-full rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-vespera-accent hover:border-vespera-accent/40 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-300 group/add">
                    <div className="p-2 rounded-full bg-white dark:bg-white/10 shadow-sm group-hover/add:scale-110 group-hover/add:shadow-md transition-all duration-300">
                        <Plus size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide">Add</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryBlock;