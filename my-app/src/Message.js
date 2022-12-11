import React from "react";
import "./styles/style.css";
// JSX class => className

const Message = ({ msg, messages, setMessages, id }) => {
  const deleteHandler = () => {
    setMessages(messages.filter((m) => m.id !== msg.id));
  };
  return (
    <div className="msg">
      {/* class is reversed in JS */}
      <p>{msg.input}</p>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
};

export default Message;
