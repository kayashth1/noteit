import React, { useEffect, useState } from "react";
import Nav from "../../components/Navbar/Nav";
import NoteCard from "../../components/NoteCard/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from 'react-modal';
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allnotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all notes
  const getAllNotes = async (query = "") => {
    try {
      const response = await axiosInstance.get(query ? "/search-notes" : "/get-all-notes", {
        params: { query }
      });
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again!");
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", 'delete');
        getAllNotes(searchQuery);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("An Unexpected Error Occurred");
      }
    }
  };

  //Update isPinned

  const updateisPinned = async (noteData)=>{
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
       "isPinned" : !noteData.isPinned,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully")
        getAllNotes();
       
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { };
  }, []);

  useEffect(() => {
    getAllNotes(searchQuery);
  }, [searchQuery]);

  return (
    <>
      <Nav userInfo={userInfo} setSearchQuery={setSearchQuery} />
      <div className="container mx-auto">
        {allnotes.length > 0 ? <div className="grid grid-cols-3 gap-4 mt-8">
          {allnotes.map((item) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={moment(item.createdAt).format('Do MMM YYYY')}
              content={item.content}
              tags={item.tags}
              onEdit={() => { handleEdit(item); }}
              onDelete={() => { deleteNote(item); }}
              onPinNote={() => updateisPinned(item)}
              isPinned={item.isPinned}
            />
          ))}
        </div> : <EmptyCard />}
      </div>

      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}>
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={() => getAllNotes(searchQuery)}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <ToastMessage
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
