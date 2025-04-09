import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

function AddEditNotes({ noteData, getAllNotes, type, onClose, showToastMessage }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (type === "edit" && noteData) {
      setTitle(noteData?.title);
      setContent(noteData?.content);
      setTags(noteData?.tags);
    }
  }, [type, noteData]);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully", "success");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.post("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", "success");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className='relative'>
      <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500' onClick={onClose}>
        <MdClose className='text-xl text-slate-400' />
      </button>
      <div className='flex flex-col gap-2'>
        <label className='text-xs text-slate-400 '>TITLE</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go to Gym daily'
          value={title}
          required
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='text-xs text-slate-400'>Content</label>
        <textarea
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Content'
          rows={10}
          required
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>

      <div className='mt-3'>
        <label className='text-xs text-slate-400'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      <button className='bg-blue-500 font-medium mt-5 p-3' onClick={handleAddNote}>
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
}

export default AddEditNotes;