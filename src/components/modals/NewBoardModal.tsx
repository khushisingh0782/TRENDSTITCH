import React, { useState } from 'react';
import { X, Plus, FolderPlus, Sparkles } from 'lucide-react';
import { Moodboard } from '../../types';

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (board: Moodboard) => void;
}

export const NewBoardModal: React.FC<NewBoardModalProps> = ({
  isOpen,
  onClose,
  onCreateBoard,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('Indo-Western, Silks, Streetwear');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBoard: Moodboard = {
      id: `board-${Date.now()}`,
      title: title.trim(),
      itemCount: 0,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      totalValue: 0,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      ],
    };

    onCreateBoard(newBoard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#161616] w-full max-w-md p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#EAE5DE] pb-2">
          <div className="flex items-center space-x-2">
            <FolderPlus className="w-4 h-4 text-[#C83818]" />
            <h3 className="font-editorial text-lg font-bold text-[#161616]">
              Create Curated Moodboard
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:text-[#C83818]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Board Name / Archetype
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Diwaliphire Capsule 2026, Delhi Streetwear"
              className="w-full bg-[#F5F1EB] border border-[#EAE5DE] p-2.5 text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8E8A85]">
              Curation Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Linen, Organza, Jhumkas"
              className="w-full bg-[#F5F1EB] border border-[#EAE5DE] p-2.5 text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8E8A85] hover:text-[#161616]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#161616] hover:bg-[#3A3836] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Initialize Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
