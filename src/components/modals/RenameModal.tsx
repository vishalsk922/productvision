import React, { useState } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import type { UserConfiguration } from '../../types';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserConfiguration | null;
  onRename: (id: string, newTitle: string) => void;
}

const RenameModalContent: React.FC<{
  config: UserConfiguration;
  onClose: () => void;
  onRename: (id: string, newTitle: string) => void;
}> = ({ config, onClose, onRename }) => {
  const [title, setTitle] = useState(config.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onRename(config.id, title.trim());
      onClose();
    }
  };

  return (
    <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Rename Configuration</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Configuration Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midnight Apex Hyper-Tourer"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Name</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  config,
  onRename,
}) => {
  if (!isOpen || !config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <RenameModalContent
        key={config.id}
        config={config}
        onClose={onClose}
        onRename={onRename}
      />
    </div>
  );
};
