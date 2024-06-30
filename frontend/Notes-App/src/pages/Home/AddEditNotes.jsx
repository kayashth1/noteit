import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md';
function AddEditNotes({noteData, type,onClose}) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

  const addNewNote = async () =>{

  }

  const editNote = async () =>{
    
  }

  const handleAddNote = ()=>{
    if(type === "edit"){
      editNote();

    }
    else{
      addNewNote();
    }
  }

  return (
    <div className='relative'>      
      <button className='w-10 h-10 rounded-full flex items-centerjustify-center absolute -top-3 -right-3 hover-bg-slate-500' onClick={onClose}>
        <MdClose className='text-xl text-slate-400'/>
      </button>
        <div className='flex flex-col gap-2'>
            <label className='text-xs text-slate-400 '>TITLE</label>
        <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='Go to Gym daily' 
        value={title}
        required
        onChange={({target}) => setTitle(target.value)}/>
        </div>

        <div className='flex flex-col gap-2 mt-4'>
            <label className='text-xs text-slate-400'>Content</label>
            <textarea name="" className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Content' rows={10}
            required
            value={content}
            onChange={({target}) => setContent(target.value)}
            ></textarea>
        </div>

        <div className='mt-3'>
            <label className='text-xs text-slate-400'>TAGS</label>
            <TagInput tags={tags} setTags={setTags}/>
        
        </div>

<button className='bg-blue-500 font-medium mt-5 p-3' onClick={()=> {handleAddNote}}>
  ADD
</button>
    </div>
  )
}

export default AddEditNotes