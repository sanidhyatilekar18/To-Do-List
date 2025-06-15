import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState(() => {
  try {
    const saved = localStorage.getItem('todo-notes-app');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const statusOptions = ['Pending', 'In progress', 'Completed'];
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('None');


useEffect(() => {
  const storedNotes = JSON.parse(localStorage.getItem('todo-notes-app'));
  if (storedNotes) {
    setNotes(storedNotes);
  }
}, []);

useEffect(() => {
  localStorage.setItem('todo-notes-app', JSON.stringify(notes));
}, [notes]);


  const addNote = () => {
    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required!');
      return;
    }

 const maxAllowedDate = new Date("2031-12-31");
    const selectedDueDate = new Date(dueDate);

    if (dueDate && selectedDueDate > maxAllowedDate) {
      alert("Due date cannot be after 2031-12-31 ");
      return;
    }

    if (edit) {
      setNotes(notes.map(note =>
        note.id === editId
          ? { ...note, title, description, dueDate }
          : note
      ));
      setEdit(false);
      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title,
        description,
        dueDate,
        status: 'Pending'
      };
      setNotes([...notes, newNote]);
    }
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setDueDate(note.dueDate || '');
    setEdit(true);
    setEditId(note.id);
  };

  const handleStatusChange = (id, newStatus) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, status: newStatus } : note
    ));
  };

  
  let filteredNotes = [...notes];

  if (filterStatus !== 'All') {
    filteredNotes = filteredNotes.filter(note => note.status === filterStatus);
  }

  if (sortOrder === 'Due Date') {
    filteredNotes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortOrder === 'Title') {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div>
      <header className="flex justify-center items-center bg-purple-800 h-20 text-white font-bold text-4xl font-serif">
        <h1>To Do List</h1>
      </header>

      <div className="flex justify-center items-center flex-col p-5">
        <div>
          <input
            type="text"
            placeholder="Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />
          <textarea
            placeholder="Comments"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            rows="2"
          />
          <label className='font-bold ml-2'> Due Date </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            max="2031-12-31"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />
          <button
            onClick={addNote}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-center"
          >
            {edit ? 'Update' : 'Add'}
          </button>

          <select onChange={(e) => setFilterStatus(e.target.value)} className='m-3 bg-slate-100 rounded-md p-1.5 shadow-md'>
            <option>All</option>
            <option>Pending</option>
            <option>In progress</option>
            <option>Completed</option>
          </select>

          <select onChange={(e) => setSortOrder(e.target.value)} className='m-3 bg-slate-100 rounded-md p-1.5 shadow-md'>
            <option>None</option>
            <option>Due Date</option>
            <option>Title</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center flex-col p-5">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-4 rounded-xl shadow-lg flex justify-evenly items-center mb-5 mt-5 bg-gray-100 "
          >
            <div className="mr-4">
              <h3 className="font-bold">{note.title}</h3>
              <p>{note.description}</p>
              <p>Due Date: {note.dueDate || 'Not set'}</p>
            </div>
            <select value={note.status} onChange={(e) => handleStatusChange(note.id, e.target.value)} className="p-2 rounded-lg">
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="flex justify-center items-center flex-row gap-3">
              <button
                onClick={() => deleteNote(note.id)}
                className="bg-red-500 text-white px-2 py-1 rounded mb-2 hover:bg-red-800"
              >
                Delete
              </button>
              <button
                onClick={() => editNote(note)}
                className="bg-green-500 text-white px-2 py-1 rounded mb-2 hover:bg-green-800"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
