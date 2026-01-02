import React, { useState, useEffect } from 'react';
import { useWebRTC } from './hooks/useWebRTC';

function App() {
  const roomId = "secret-room-123"; 
  const { messages, sendMessage, status } = useWebRTC(roomId);
  const [text, setText] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  return (
    <div style={{ background: '#121212', color: '#e0e0e0', height: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Burner Chat 🔥</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: status.includes('Connected') ? '#4caf50' : '#ff9800' }}>
              ● {status}
            </span>
            {/* We use 'tick' here to create a blinking pulse effect, fixing the warning */}
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: '#4caf50', 
              opacity: tick % 2 === 0 ? 1 : 0.3,
              transition: 'opacity 0.2s'
            }} />
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Nuke Chat
        </button>
      </header>

      <div style={{ 
        height: '65vh', 
        border: '1px solid #333', 
        borderRadius: '10px', 
        overflowY: 'auto', 
        padding: '20px', 
        background: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', color: '#555', textAlign: 'center' }}>
            No active messages. <br/> Start typing to begin an ephemeral session.
          </div>
        )}
        {messages.map(m => {
          const secondsElapsed = (Date.now() - m.id) / 1000;
          const remaining = Math.max(0, Math.ceil(30 - secondsElapsed));

          return (
            <div key={m.id} style={{ 
              marginBottom: '15px', 
              textAlign: m.sender === 'Me' ? 'right' : 'left' 
            }}>
              <div style={{ 
                background: m.sender === 'Me' ? '#007bff' : '#333', 
                color: 'white',
                display: 'inline-block', 
                padding: '10px 15px', 
                borderRadius: '15px',
                maxWidth: '70%',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                position: 'relative'
              }}>
                <div style={{ fontSize: '14px', wordBreak: 'break-word' }}>{m.text}</div>
                <div style={{ 
                  fontSize: '10px', 
                  marginTop: '5px', 
                  opacity: 0.7, 
                  textAlign: 'right',
                  color: remaining < 10 ? '#ff5252' : 'inherit',
                  fontWeight: remaining < 10 ? 'bold' : 'normal'
                }}>
                  {remaining}s
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '5px', 
            border: '1px solid #444', 
            background: '#222', 
            color: 'white',
            outline: 'none'
          }} 
          placeholder="Type a burning message..." 
        />
        <button 
          onClick={handleSend} 
          disabled={!text.trim()}
          style={{ 
            padding: '10px 25px', 
            background: text.trim() ? '#007bff' : '#555', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: text.trim() ? 'pointer' : 'default',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;