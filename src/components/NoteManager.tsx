import { useState, useEffect } from 'react';
import type { Note } from '../types';

const NoteManager: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [priority, setPriority] = useState<Note['priority']>('normal');

    // Load notes from localStorage
    useEffect(() => {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    // Save notes to localStorage
    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const addNote = () => {
        if (newNote.trim()) {
            const note: Note = {
                id: Date.now(),
                text: newNote.trim(),
                priority,
            };
            setNotes([...notes, note]);
            setNewNote('');
            setPriority('normal');
        }
    };

    const deleteNote = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const updateNotePriority = (id: number, newPriority: Note['priority']) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, priority: newPriority } : note
        ));
    };

    const getPriorityNotes = (priority: Note['priority']) => {
        return notes.filter(note => note.priority === priority);
    };

    const getPriorityColor = (priority: Note['priority']) => {
        switch (priority) {
            case 'important': return 'bg-red-50 border-red-300 text-red-800';
            case 'normal': return 'bg-blue-50 border-blue-300 text-blue-800';
            case 'delayed': return 'bg-purple-50 border-purple-300 text-purple-800';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-800">Note Manager</h2>

            {/* Add Note Form */}
            <div className="flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note..."
                    className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Note['priority'])}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                >
                    <option value="important">Important</option>
                    <option value="normal">Normal</option>
                    <option value="delayed">Delayed</option>
                </select>
                <button
                    onClick={addNote}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg transition-colors"
                >
                    Add Note
                </button>
            </div>

            {/* Notes by Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['important', 'normal', 'delayed'] as Note['priority'][]).map(priority => (
                    <div key={priority} className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
                        {/* Column Header */}
                        <div className={`p-3 font-semibold text-center capitalize tracking-wide 
                            ${priority === 'important' ? 'bg-red-100 text-red-800' :
                            priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'}`}>
                            {priority}
                        </div>

                        {/* Notes List */}
                        <div className="p-3 space-y-3 max-h-72 overflow-y-auto overflow-x-hidden">
                            {getPriorityNotes(priority).map(note => (
                                <div
                                    key={note.id}
                                    className={`p-3 rounded-lg border ${getPriorityColor(note.priority)} shadow-sm`}
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm leading-relaxed wrap-break-word">{note.text}</span>
                                        <div className="flex gap-1 flex-wrap">
                                            <select
                                                value={note.priority}
                                                onChange={(e) => updateNotePriority(note.id, e.target.value as Note['priority'])}
                                                className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none"
                                            >
                                                <option value="important">Important</option>
                                                <option value="normal">Normal</option>
                                                <option value="delayed">Delayed</option>
                                            </select>
                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {getPriorityNotes(priority).length === 0 && (
                                <div className="text-center text-gray-500 py-4 text-sm italic">
                                    No {priority} notes
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoteManager;