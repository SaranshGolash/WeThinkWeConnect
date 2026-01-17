import React, { useState } from 'react';

const NegotiationChat = ({ isUnlocked, onSendMessage, messages }) => {
  const [text, setText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="w-full max-w-3xl mx-auto h-64 bg-surface/50 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center p-8 grayscale opacity-70">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-400">Negotiation Locked</h3>
        <p className="text-sm text-gray-500 mt-2">
          You must reduce the disagreement gap below 20% to speak.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface rounded-xl border border-white/10 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-black/20 p-4 border-b border-white/5 flex justify-between items-center">
        <span className="text-conflict font-bold text-sm tracking-widest">SECURE CHANNEL OPEN</span>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
      </div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
              msg.isMe ? 'bg-conflict text-black font-medium' : 'bg-gray-700 text-gray-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/20 flex gap-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Propose a compromise..."
          className="flex-grow bg-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-conflict transition"
        />
        <button type="submit" className="bg-white/10 hover:bg-conflict hover:text-black text-white px-6 py-2 rounded-lg font-bold transition">
          Send
        </button>
      </form>
    </div>
  );
};

export default NegotiationChat;