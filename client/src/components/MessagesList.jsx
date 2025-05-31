import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import MessageListItem from './MessageListItem';

const MessagesList = () => {
  const [conversations, setConversations] = useState([])
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const socket = useSelector((state) => state?.user?.socket);

  // GET CHATS FROM DB
  const getConversations = async () =>{
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/conversations`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setConversations(response?.data);
  console.log("conversation", response)

      
    } catch (err) {
      toast.error("Error Message");
      console.log(err);
    }
  }

  useEffect(()=>{
    getConversations()
  }, [socket])

  return (
    <menu className='messageList'>
      <h3>Recent Message</h3>
      {
        conversations?.map(conversation => <MessageListItem key={conversation?._id} conversation={conversation}/> )
      }
    </menu>
  )
}

export default MessagesList