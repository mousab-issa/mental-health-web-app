import React, { useState, useEffect } from "react";

import { socket } from "../utils/socket";

import fetchData, { deleteData, postData } from "../helper/apiCall";
import jwtDecode from "jwt-decode";

const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [user] = useState(
    localStorage.getItem("token")
      ? jwtDecode(localStorage.getItem("token"))
      : ""
  );

  useEffect(() => {
    fetchData(`/messages/${chatId}`)
      .then((response) => {
        console.log(response);
        setMessages(response.messages);
      })
      .catch((error) => {
        console.error(error);
      });

    function onConnect() {
      console.log("Connected");
    }

    function onDisconnect() {
      console.log("Disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.emit("joinChat", chatId);

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, []);

  const sendMessage = async (event) => {
    try {
      event.preventDefault();
      if (!messageInput) {
        return;
      }

      const data = {
        message: messageInput,
        sender_id: user.userId,
        chat_id: chatId,
      };

      await postData("/messages", data);

      socket.emit("sendMessage", data);
    } catch (error) {
      console.error(error);
    }

    setMessageInput("");
  };

  const deleteMessage = async (messageId) => {
    try {
      await deleteData(`/message/${messageId}`);
      setMessages((messages) =>
        messages.filter((message) => message._id !== messageId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <div className="overflow-y-auto h-64 mb-4">
          {messages?.map((message, index) => (
            <div key={index} className="flex flex-col my-2">
              <div
                className={`rounded-xl px-4 py-2 mb-1 ${
                  message.sender_id === user.userId
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 self-start"
                }`}
              >
                {message.message}
              </div>
              <button
                onClick={() => deleteMessage(message._id)}
                className="text-xs text-gray-500 self-end"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            placeholder="Type a message..."
            type="text"
            className="flex-grow rounded-l-xl p-2"
          />
          <button className="bg-blue-500 text-white rounded-r-xl px-4 py-2">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
