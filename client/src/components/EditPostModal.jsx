import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { uiSliceActions } from '../store/ui-slice';

const EditPostModal = ({onUpdatePost}) => {
  const editPostId = useSelector((state) => state?.ui?.editPostId);
    const token = useSelector((state) => state?.user?.currentUser?.token);
    const [body, setBody] = useState("")
    const dispatch = useDispatch()

    // GET POST TO UPDATE
    const getPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${editPostId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      setBody(response?.data?.body);
    } catch (err) {
      toast.error("Error Message");
      console.log(err)
    }
  };
  

  useEffect(()=>{
    getPost()
  }, [])

  const updatePost = async () =>{
    const postData = new FormData();
    postData.set("body", body);
    onUpdatePost(postData, editPostId)
    dispatch(uiSliceActions?.closeEditPostModal())
  }
 
  const closeEditPostModal = (e) =>{
    if(e.target.classList.contains('editPost')) {
        dispatch(uiSliceActions?.closeEditPostModal())
    }
  }


  return (
    <form onSubmit={updatePost} onClick={closeEditPostModal} className="editPost">
        <div className="editPost__container">
            <textarea value={body} onChange={(e)=> setBody(e.target.value)} placeholder="What's on your mind?"></textarea>
            <button type='submit' className='btn primary'>Update Post</button>
        </div>
    </form>
  )
}

export default EditPostModal