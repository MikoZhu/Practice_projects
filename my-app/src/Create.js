import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Create = ({ messages, setMessages }) => {
  let [input, setInput] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    setMessages([...messages, { input, id: uuidv4() }]);
    setInput("");
    // console.log(e.target.parentElement.children[0].value);
  };
  const inputHandler = (e) => {
    setInput(e.target.value);
  };

  return (
    <form>
      <input onChange={inputHandler} value={input} type="text" />
      <button onClick={submitHandler}>Submit</button>
    </form>
  );
};

export default Create;
