import React, { useState, useEffect } from 'react';
import { fetchMusic } from '../store/mediaApi';
import Modal from './Modal';

interface Music {
  name: string;
  url: string;
}

interface MusicSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (musicUrl: string) => void;
  currentMusic?: string;
}

const MusicSelector = ({ isOpen, onClose, onSelect, currentMusic }: MusicSelectorProps) => {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadMusic = async () => {
      setLoading(true);
      try {
        const fetchedMusic = await fetchMusic();
        setMusicList(fetchedMusic);
      } catch (err) {
        setError('Failed to load music');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadMusic();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Music">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading music...</div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="space-y-2">
          {musicList.map((music) => (
            <div
              key={music.url}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                currentMusic === music.url ? 'border-blue-500' : ''
              }`}
              onClick={() => {
                onSelect(music.url);
                onClose();
              }}
            >
              <div className="flex items-center space-x-4">
                <span className="text-xl">🎵</span>
                <span className="text-lg">{music.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {previewUrl !== music.url ? (
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(music.url);
                    }}
                  >
                    ▶️ Preview
                  </button>
                ) : (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(null);
                    }}
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>
            </div>
          ))}
          {previewUrl && (
            <audio
              src={previewUrl}
              autoPlay
              onEnded={() => setPreviewUrl(null)}
              className="hidden"
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default MusicSelector;