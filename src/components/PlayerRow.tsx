import React, { useState } from 'react';
import ImageSelector from './ImageSelector';
import MusicSelector from './MusicSelector';
import '../css/PlayerRow.css';

interface Player {
  id: string;
  name: string;
  imageUrl?: string;
  musicUrl?: string;
}

interface PlayerRowProps {
  player: Player;
  isFirst: boolean;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onClick: () => void;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
  isDragging: boolean;
  onUpdate: (id: string, updates: Partial<Player>) => void;
}

const PlayerRow = ({
  player,
  isFirst,
  onDelete,
  isSelected,
  onClick,
  onDragStart,
  onDrop,
  isDragging,
  onUpdate
}: PlayerRowProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(player.name);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [isMusicSelectorOpen, setIsMusicSelectorOpen] = useState(false);

  const handleNameSubmit = () => {
    if (newName.trim() !== player.name) {
      onUpdate(player.id, { name: newName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <>
      <div
        className={`player-row ${isFirst ? 'first-row' : ''} ${
          isSelected ? 'selected-row' : ''
        } ${isDragging ? 'dragging' : ''}`}
        onClick={onClick}
        draggable
        onDragStart={() => onDragStart(player.id)}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(player.id);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        <div className="player-avatar-wrapper relative group">
          <img
            src={player.imageUrl || 'https://raw.githubusercontent.com/trpascua/gallery_simple_template/main/Character/Sprite-0002.png'}
            alt={`${player.name}'s avatar`}
            className="player-avatar"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsImageSelectorOpen(true);
            }}
            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
          >
            <span className="text-white text-2xl">🖼️</span>
          </button>
        </div>

        <div className="player-info">
          {isEditingName ? (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleNameSubmit();
                }}
                className="border rounded px-2 py-1 text-lg font-semibold"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="player-name">{player.name}</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                  setNewName(player.name);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✏️
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMusicSelectorOpen(true);
              }}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              🎵 {player.musicUrl ? 'Change Music' : 'Add Music'}
            </button>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(player.id);
          }}
          className="delete-button"
          aria-label="Delete player"
        >
          ✕
        </button>
      </div>

      <ImageSelector
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelect={(imageUrl) => onUpdate(player.id, { imageUrl })}
        currentImage={player.imageUrl}
      />

      <MusicSelector
        isOpen={isMusicSelectorOpen}
        onClose={() => setIsMusicSelectorOpen(false)}
        onSelect={(musicUrl) => onUpdate(player.id, { musicUrl })}
        currentMusic={player.musicUrl}
      />
    </>
  );
};

export default PlayerRow;