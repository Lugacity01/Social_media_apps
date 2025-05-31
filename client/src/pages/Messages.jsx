import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileImage from "../components/ProfileImage";
import MessageItem from "../components/MessageItem";
import { IoMdSend } from "react-icons/io";
import { userActions } from "../store/user-slice";

const Messages = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [otherMessager, setOtherMessager] = useState({});
  // const [responderPhoto, setResponderPhoto] = useState({});
  const [messageBody, setMessageBody] = useState("");
  const [conversationId, setConversationId] = useState("");
  const messageEndRef = useRef();

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  // GET OTHER PARTICIPANT CHATTING
  const getOtherMessager = useCallback(async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/${receiverId}`,
      { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
    );
    setOtherMessager(response?.data);
  }, [receiverId, token]);

  useEffect(() => {
    messageEndRef?.current?.scrollIntoView();
  }, [messages]);

  // GET THE MESSAGES
  const getMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("The receiver of the message", messages);
      setMessages(response?.data);
      setConversationId(response?.data?.[0]?.conversationId);
      // setResponderPhoto(response?.data);
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  }, [messages, receiverId, token]);

  const socket = useSelector((state) => state?.user?.socket);

  // SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
        {
          messageBody,
          senderPhoto: currentUser?.profilePhoto,
          receiverPhoto: otherMessager?.profilePhoto,
        },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prevMessages) => [...prevMessages, response?.data]);
      setMessageBody("");
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  };

  const dispatch = useDispatch();
  const conversations = useSelector((state) => state?.user?.conversations);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      dispatch(
        userActions?.setConversations(
          conversations.map((conversation) => {
            if (conversation?._id == conversationId) {
              return {
                ...conversation,
                lastMessage: { ...conversation.lastMessage, seen: true },
              };
            }
          })
        )
      );

      return () => socket.off("newMessage");
    });
  }, [socket, messages, dispatch, conversations, conversationId]);

  useEffect(() => {
    getMessages();
    getOtherMessager();
  }, [getMessages, getOtherMessager, receiverId]);

  return (
    <>
      {
        <section className="messagesBox">
          <header className="messagesBox__header">
            <ProfileImage image={otherMessager?.profilePhoto} />

            <div className="messagesBox__header-info">
              <h4>{otherMessager?.fullName}</h4>
              <small>last seen 2 mins ago</small>
            </div>
          </header>

          <ul className="messagesBox__messages">
            {messages?.map((message) => (
              <MessageItem
                message={message}
                imageSender={currentUser?.profilePhoto}
                receiverPhoto={otherMessager?.profilePhoto}
              />
            ))}

            <div ref={messageEndRef}></div>
          </ul>

          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={messageBody}
              onChange={({ target }) => setMessageBody(target.value)}
              placeholder="Enter Message..."
              autoFocus
            />
            <button type="submit">
              <IoMdSend />
            </button>
          </form>
        </section>
      }
    </>
  );
};

export default Messages;
