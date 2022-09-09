import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "./firebaseConfig";
import ReactPaginate from "react-paginate";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Modal from "react-modal";
import PinnedIcon from "./images/pin.svg";
import DeleteIcon from "./images/trash.svg";
import "./App.css";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  content: {
    width: "500px",
    height: "500px",
    top: "47%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "25px",
    border: "1px solid rgb(30, 30, 30)",
    backgroundColor: "rgb(15, 15, 15)",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 3px 8px",
  },
};

function App() {

  // All the States
  const [note, setNote] = useState({ title: "", tagline: "", body: "" });
  const [notes, setNotes] = useState([]);
  const [pinned, setPinned] = useState(false);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [modalIsOpen, setIsOpen] = React.useState(false);

  // Collection Reference of Document from Firestore
  const notesCollectionRef = collection(db, "notes");

  // Queries for (Data Ordering)
  const q = query(notesCollectionRef, orderBy("createdAt", "desc"));

  // Function of Creating New Note 
  const createNote = async (e) => {
    e.preventDefault();
    if (note.title === "" || note.tagline === "" || note.body === "") {
      return alert("Text Fields cannot be empty!");
    }
    await addDoc(notesCollectionRef, {
      title: note.title,
      tagline: note.tagline,
      body: note.body,
      createdAt: serverTimestamp(),
    });
    setNote(() => ({ title: "", tagline: "", body: "" }));
    closeModal();
  };

  // Function of Pinned the Note
  const addPinnedNote = (id) => {
    setPinned(true);
    const pinnedData = notes.find((note) => note.id === id);
    setPinnedNotes((prev) => [pinnedData, ...prev]);
    deleteNote(id);
  };

  // Function of UnPinned the Note
  const unPinnedNote = async (id) => {
    const unpinnedData = pinnedNotes.find((note) => note.id === id);
    await addDoc(notesCollectionRef, {
      title: unpinnedData.title,
      tagline: unpinnedData.tagline,
      body: unpinnedData.body,
      createdAt: serverTimestamp(),
    });
    setPinnedNotes((prev) => prev.filter((item) => item.id !== id));
  };

  // Function of Deleting the Note
  const deleteNote = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
  };

  // Function of Deleting the UnPinned Note
  const deletePinnedNote = (id) => {
    setPinnedNotes((prev) => prev.filter((item) => item.id !== id));
  };

  // React Modal Implementation
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // React Paginate Implementation
  const notesPerPage = 6;
  const pagesVisited = pageNumber * notesPerPage;
  const displayNotes = notes.slice(pagesVisited, pagesVisited + notesPerPage);
  const pageCount = Math.ceil(notes.length / notesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // UseEffect Hook for Getting Data from Firestore
  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    if (pinnedNotes.length === 0) {
      setPinned(false);
    }
  }, [notes]);

  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar />
        <div
          className={
            notes.length + pinnedNotes.length > 5 ? "scroll" : "note-container"
          }
        >
          <button onClick={openModal} className="btn-create-note">
            Create New Note
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
          >
            <h2 className="modal-title">Create New Note</h2>

            <input
              type="text"
              className="input-field"
              placeholder="title"
              value={note.title}
              required
              onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
            <input
              type="text"
              className="input-field"
              placeholder="tagline"
              value={note.tagline}
              required
              onChange={(e) => setNote({ ...note, tagline: e.target.value })}
            />
            <textarea
              rows="5"
              type="text"
              className="text-area"
              placeholder="body"
              value={note.body}
              required
              onChange={(e) => setNote({ ...note, body: e.target.value })}
            />
            <div className="btn-box">
              <button className="btn-close" onClick={closeModal}>
                Close
              </button>
              <button className="btn-save" onClick={createNote}>
                Save
              </button>
            </div>
          </Modal>
          <div>
            {pinned && (
              <>
                <h3 className="pinned-notes-heading">Pinned Notes</h3>
                <div className="pinned-notes-box">
                  {pinnedNotes.map((note) => {
                    return (
                      <div key={note.id} className="note-card">
                        <div className="flex">
                          <h3 className="card-title">{note.title}</h3>
                          <div className="card-btn">
                            <img
                              className="card-pinned-icon black"
                              src={PinnedIcon}
                              alt="icon"
                              title="unpinned"
                              onClick={() => unPinnedNote(note.id)}
                            />
                            <img
                              className="card-trash-icon"
                              src={DeleteIcon}
                              alt="icon"
                              title="Delete"
                              onClick={() => {
                                deletePinnedNote(note.id);
                              }}
                            />
                          </div>
                        </div>
                        <h4 className="card-tagline">{note.tagline}</h4>
                        <p>{note.body}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <>
            <h3 className="other-notes-heading">Other Notes</h3>
            <div className="notes-box">
              {displayNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <div className="flex">
                    <h3 className="card-title">{note.title}</h3>
                    <div className="card-btn">
                      <img
                        className="card-pinned-icon"
                        src={PinnedIcon}
                        alt="icon"
                        title="Pinned"
                        onClick={() => addPinnedNote(note.id)}
                      />
                      <img
                        className="card-trash-icon"
                        src={DeleteIcon}
                        alt="icon"
                        title="Delete"
                        onClick={() => {
                          deleteNote(note.id);
                        }}
                      />
                    </div>
                  </div>
                  <h4 className="card-tagline">{note.tagline}</h4>
                  <p>{note.body}</p>
                </div>
              ))}
            </div>
          </>
          <div className="pagination">
            <ReactPaginate
              previousLabel={"Prev"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBtns"}
              previousLinkClassName={"previosBtn"}
              nextLinkClassName={"nextBtn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
