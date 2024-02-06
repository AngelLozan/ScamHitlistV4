import React from 'react';
import "./App.css";
import { useState, useEffect } from 'react';


type Note = {
  id: number;
  title: string;
  content: string;
};


const App = () => {

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    // const newNote: Note = {
    //   id: notes.length + 1,
    //   title: title,
    //   content: content,
    // };

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })
      const newNote: Note = await res.json();
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.log(error);
    }

  };


  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedNote) {
      return;
    }

    // const updatedNote: Note = {
    //   id: selectedNote.id,
    //   title: title,
    //   content: content,
    // };

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })
      const updatedNote = await res.json();
      const updatedNotesList = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note));

      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      console.log(error);
    }


  };


  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    const res = await fetch(`http://localhost:5000/api/notes/${noteId}`,{
      method: "DELETE"
    })
    
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/notes");
      const notes: Note[] = await response.json();
      setNotes(notes);
    } catch (error) {
      console.log(error);
    }
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([
    // {
    //   id: 1,
    //   title: "test note 1",
    //   content: "bla bla note1",
    // },
    // {
    //   id: 2,
    //   title: "test note 2 ",
    //   content: "bla bla note2",
    // },
    // {
    //   id: 3,
    //   title: "test note 3",
    //   content: "bla bla note3",
    // },
    // {
    //   id: 4,
    //   title: "test note 4 ",
    //   content: "bla bla note4",
    // },
    // {
    //   id: 5,
    //   title: "test note 5",
    //   content: "bla bla note5",
    // },
    // {
    //   id: 6,
    //   title: "test note 6",
    //   content: "bla bla note6",
    // },
  ]);
  useEffect(() => {
    fetchNotes();
  }, [])

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleAddNote(event))}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          required
        ></input>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content"
          rows={10}
          required
        ></textarea>

        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-item" onClick={() => handleNoteClick(note)}>
            <div className="notes-header">
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
