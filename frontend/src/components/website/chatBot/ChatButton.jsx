import React from "react";

function ChatButton({ open, toggleChat }) {
  return (
    <button
      className={`chat-button ${open ? "hidden" : ""}`}
      onClick={toggleChat}
    >
      <svg viewBox="0 0 39 37" className="chat-icon">
        {/* Add SVG content */}
      </svg>
    </button>
  );
}

export default ChatButton;
