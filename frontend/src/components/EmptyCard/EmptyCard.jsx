import React from 'react';

const EmptyCard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 m-6 bg-gray-100 rounded-lg shadow-md max-w-sm mx-auto">
      <div className="flex items-center justify-center w-24 h-24 mb-4 bg-gray-200 rounded-full">
        {/* Placeholder for empty notes design */}
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10l-6 6m0 0l-6-6m6 6V4"></path>
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold">No Notes Yet</h2>
      <p className="mb-4 text-gray-600">It looks like you haven't created any notes yet. You can create notes by clicking on the + button below.</p>
     
    </div>
  );
};

export default EmptyCard;
