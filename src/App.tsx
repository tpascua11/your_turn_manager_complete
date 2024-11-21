// App.tsx
import { useState } from 'react'
import './App.css'
import PlayerRow from './components/PlayerRow.tsx'

interface Player {
  id: string;
  name: string;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Dragon' },
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer = {
        id: (players.length + 1).toString(),
        name: newPlayerName.trim()
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      setShowInput(false);
    }
  };

  const deletePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
    if (selectedPlayerId === id) {
      setSelectedPlayerId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setNewPlayerName('');
    }
  };

  // New drag and drop functions
  const handleDragStart = (playerId: string) => {
    setDraggedPlayer(playerId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetPlayerId: string) => {
    if (!draggedPlayer || draggedPlayer === targetPlayerId) return;

    const draggedIndex = players.findIndex(p => p.id === draggedPlayer);
    const targetIndex = players.findIndex(p => p.id === targetPlayerId);
    
    const newPlayers = [...players];
    const [removed] = newPlayers.splice(draggedIndex, 1);
    newPlayers.splice(targetIndex, 0, removed);
    
    setPlayers(newPlayers);
    setDraggedPlayer(null);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="player-list" onDragOver={handleDragOver}>
          {players.map((player, index) => (
            <PlayerRow 
              key={player.id} 
              player={player} 
              isFirst={index === 0}
              onDelete={deletePlayer}
              isSelected={selectedPlayerId === player.id}
              onClick={() => setSelectedPlayerId(player.id)}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              isDragging={draggedPlayer === player.id}
            />
          ))}
        </div>

        {showInput && (
          <div className="input-panel">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter player name"
              className="input-field"
              autoFocus
            />
            <div className="button-group">
              <button
                onClick={() => {
                  setShowInput(false);
                  setNewPlayerName('');
                }}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={addPlayer}
                className="add-button"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowInput(true)}
          className="float-button"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default App;