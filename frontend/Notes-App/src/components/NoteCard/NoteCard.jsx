import React from 'react';
import '../NoteCard/NoteCard.css';
import { MdCreate, MdDelete, MdOutlinePushPin } from 'react-icons/md';

function NoteCard({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
        <div className='flex items-centre justify-between'>
            <div>
                <h6 className='text-sm font-medium'>{title}</h6>
                <span className='text-xs text-slate-500'>{date}</span>
            </div>
            <MdOutlinePushPin className={`text-xl text-slate-300 cursor-pointer hover:text-blue ${isPinned ? 'text-blue-500' : 'text-slate-300'}`} onClick={onPinNote} />

        </div>
        <p className='text-xs text-slate-500 mt-2 '>{content?.slice(0,60)}</p>
        <div className='flex items-centre justify-between mt-2'>
            <div className='text-xs text-slate-500'>{tags}</div>
            <div className='flex items-centre gap-2'>
                <MdCreate className='text-xl text-slate-300 cursor-pointer hover:text-blue hover:text-green-600' onClick={onEdit}/>

                <MdDelete className="text-xl text-slate-300 cursor-pointer hover:text-blue hover:text-red-500" onClick={onDelete}/>
            </div>
        </div>
    </div>
   
  );
}

export default NoteCard;
