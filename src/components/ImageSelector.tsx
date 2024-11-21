import React, { useState, useEffect } from 'react';
import { fetchImages } from '../store/mediaApi';

import Modal from './Modal';

interface Image {
  name: string;
  url: string;
}

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageSelector = ({ isOpen, onClose, onSelect, currentImage }: ImageSelectorProps) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const fetchedImages = await fetchImages();
        setImages(fetchedImages);
      } catch (err) {
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Character Image">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading images...</div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.url}
              className={`relative cursor-pointer border-2 rounded-lg overflow-hidden hover:border-blue-500 ${
                currentImage === image.url ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => {
                onSelect(image.url);
                onClose();
              }}
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                {image.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default ImageSelector;