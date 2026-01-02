# 🔥 Burner Chat: Ephemeral P2P Messaging

A secure, zero-footprint messaging application built for the 2026 web. This application enables users to communicate directly via a private "tunnel," ensuring that messages exist only in volatile memory (RAM) and vanish forever after a set period.



## 🚀 Key Features
- **True Peer-to-Peer (P2P):** Utilizes WebRTC DataChannels to send messages directly between browsers. No chat data ever touches the server.
- **Zero-Knowledge Signaling:** The Node.js server acts only as a "matchmaker" for the initial handshake and remains blind to the conversation.
- **Volatile Storage:** Messages are never written to a database or disk. Refreshing the page "burns" the evidence immediately.
- **Auto-Destruct Logic:** Every message features a 30-second self-destruct timer with a live visual countdown.
- **Nuke Button:** Includes a "Self-Destruct" feature to instantly terminate the session and clear screens for both participants.

## 🛠️ Tech Stack
- **Frontend:** React.js (Hooks, State Management)
- **Networking:** WebRTC (RTCPeerConnection), Socket.io-client
- **Backend:** Node.js (Signaling Server), Socket.io
- **Security:** DTLS Encryption (Built-in WebRTC), RAM-only persistence

## 📦 How to Run
1. **Clone the repository:**
   ```bash
   git clone <your-repo-link>
