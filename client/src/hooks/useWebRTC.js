import { useEffect, useRef, useState } from 'react';
import socket from '../socket';

export const useWebRTC = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('Disconnected');
  const pc = useRef(new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }));
  const dc = useRef(null);

  useEffect(() => {
    socket.emit('join-room', roomId);

    socket.on('user-joined', async (userId) => {
      // Only create the offer if we are the one who was already in the room
      dc.current = pc.current.createDataChannel("chat");
      setupDataChannel(dc.current);
      
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.emit('signal', { target: userId, desc: pc.current.localDescription });
    });

    socket.on('signal', async ({ from, desc, candidate }) => {
      if (desc) {
        // PREVENT THE ERROR: Only set description if state is appropriate
        if (desc.type === 'offer' && pc.current.signalingState !== 'stable') return;
        
        await pc.current.setRemoteDescription(new RTCSessionDescription(desc));
        
        if (desc.type === 'offer') {
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          socket.emit('signal', { target: from, desc: pc.current.localDescription });
        }
      } else if (candidate) {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle ICE Candidates
    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('signal', { target: roomId, candidate: e.candidate });
      }
    };

    pc.current.ondatachannel = (e) => setupDataChannel(e.channel);
  }, [roomId]);

  const setupDataChannel = (channel) => {
    dc.current = channel;
    channel.onopen = () => setStatus('Securely Connected');
    channel.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages(prev => [...prev, msg]);
      // The BURN: Auto-delete from RAM
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== msg.id));
      }, 30000);
    };
  };

  const sendMessage = (text) => {
    const msg = { id: Date.now(), text, sender: 'Peer' };
    if (dc.current?.readyState === 'open') {
      dc.current.send(JSON.stringify(msg));
      setMessages(prev => [...prev, { ...msg, sender: 'Me' }]);
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== msg.id));
      }, 30000);
    }
  };

  return { messages, sendMessage, status };
};