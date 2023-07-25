import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { socket } from "../utils/socket";
import axios from "axios";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";

const PAGE_SIZE = 200;

const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const messageInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  console.log(user);
  const observer = useRef();

  const loadMore = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await fetchData(
        `/chat/${chatId}?page=${page}&limit=${PAGE_SIZE}`
      );

      setChat(response.chat);
      const newMessages = response.messages.docs;

      if (newMessages.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
  }, [chatId, page, hasMore]);

  const lastMessageElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore]
  );

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (!user) {
      return;
    }

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
      if (message.sender_id !== user._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message");
    };
  }, [chatId, user]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!messageInput || !user) {
      return;
    }

    const data = {
      message: messageInput,
      sender_id: user._id,
      chat_id: chatId,
      createdAt: new Date(),
    };

    setMessageInput("");
    setMessages((prevMessages) => [...prevMessages, data]);

    try {
      socket.emit("sendMessage", data);
    } catch (error) {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message !== data)
      );
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`/chat/message/${messageId}`);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleTimeString()}`;
  };

  return !user ? (
    <Loading />
  ) : (
    <div className="h-fill bg-gray-100">
      <div className="p-6">
        <div className="overflow-y-auto h-[75vh] mb-6 space-y-4">
          {messages?.map((message, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? lastMessageElementRef : null}
              className="flex flex-col my-2"
            >
              <div
                className={`flex flex-col justify-between rounded-xl px-4 py-2 mb-1 shadow-md ${
                  message.sender_id === user._id
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 self-start"
                }`}
              >
                <span>{message.message}</span>
                <span className="text-xs text-gray-500 self-start">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex">
          <input
            ref={messageInputRef}
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            placeholder="Type a message..."
            type="text"
            className="flex-grow rounded-l-xl p-2 border border-gray-300 md:w-2/3"
          />
          <button className="bg-blue-500 text-white rounded-r-xl px-4 py-2 md:w-1/3">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
