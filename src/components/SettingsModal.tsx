import React, { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, AlertTriangle, FileJson, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
  totalEntries: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onExport, 
  onImport, 
  onClear,
  totalEntries
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        onImport(file);
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch (err) {
        setImportStatus('error');
      }
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onClear();
      setConfirmDelete(false);
      onClose();
    } else {
      setConfirmDelete(true);
      // Reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Optimized: No blur on mobile */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/70 md:backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content - Added gpu-layer for smoother animation */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1A1A2E] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden animate-fade-in-up gpu-layer">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Cài đặt</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Data Management Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Dữ liệu & Lưu trữ</h3>
            
            {/* Export */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500">
                  <Download size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Sao lưu dữ liệu</p>
                  <p className="text-xs text-gray-400">{totalEntries} ký ức hiện có</p>
                </div>
              </div>
              <button 
                onClick={onExport}
                className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20 transition-all shadow-sm"
              >
                Tải về
              </button>
            </div>

            {/* Import */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-500">
                  {importStatus === 'success' ? <CheckCircle2 size={20} /> : <Upload size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Khôi phục</p>
                  <p className="text-xs text-gray-400">Nhập file JSON</p>
                </div>
              </div>
              <div>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    accept=".json"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all shadow-sm ${importStatus === 'success' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/20'}`}
                >
                  {importStatus === 'success' ? 'Thành công' : 'Chọn file'}
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-white/5" />

          {/* Danger Zone */}
          <div className="space-y-4">
             <h3 className="text-xs font-bold uppercase tracking-widest text-red-400">Vùng nguy hiểm</h3>
             
             <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-600 dark:text-red-400">Xóa toàn bộ dữ liệu</p>
                        <p className="text-xs text-red-400/80 mt-1 leading-relaxed">Hành động này sẽ xóa vĩnh viễn tất cả các bài viết và không thể khôi phục. Hãy chắc chắn bạn đã sao lưu.</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleDeleteClick}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${confirmDelete ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30' : 'bg-white dark:bg-white/10 text-red-500 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                >
                    <Trash2 size={16} />
                    {confirmDelete ? 'Nhấn lần nữa để xác nhận xóa' : 'Xóa tất cả'}
                </button>
             </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#151525] text-center">
            <p className="text-[10px] text-gray-400">Vespera v1.0 • Your data stays on your device.</p>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;