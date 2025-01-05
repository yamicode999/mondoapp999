import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, Pencil, Trash2, X } from 'lucide-react'
import { useLongPress } from 'use-long-press'
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

interface Note {
  id: string
  content: string
  date: string
  author: 'koko' | 'babe'
}

export function SweetNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [author, setAuthor] = useState<'koko' | 'babe'>('koko')
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  useEffect(() => {
    console.log('Setting up Firestore listener');
    const q = query(collection(db, 'sweetNotes'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Received Firestore update:', snapshot.docs);
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      })) as Note[];
      
      console.log('Processed notes data:', notesData);
      setNotes(notesData);
    }, (error) => {
      console.error('Firestore listener error:', error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedNote) {
        const target = event.target as HTMLElement
        if (!target.closest('.note-menu') && !target.closest('.note-content')) {
          setSelectedNote(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedNote])

  const addNote = async () => {
    if (newNote.trim()) {
      try {
        console.log('Attempting to add note:', {
          content: newNote.trim(),
          author,
          timestamp: new Date().toISOString()
        });
        
        await addDoc(collection(db, 'sweetNotes'), {
          content: newNote.trim(),
          author,
          timestamp: new Date().toISOString()
        });
        
        console.log('Note added successfully');
        setNewNote('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  }

  const bind = useLongPress((_, { context }) => {
    const noteId = context as string
    setSelectedNote(noteId)
  }, {
    threshold: 500,
    cancelOnMovement: true
  })

  const handleEdit = (note: Note) => {
    setEditingNote(note.id)
    setEditContent(note.content)
    setSelectedNote(null)
  }

  const handleDelete = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'sweetNotes', noteId))
      setSelectedNote(null)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const saveEdit = async () => {
    if (editingNote && editContent.trim()) {
      try {
        await updateDoc(doc(db, 'sweetNotes', editingNote), {
          content: editContent.trim()
        })
        setEditingNote(null)
        setEditContent('')
      } catch (error) {
        console.error('Error updating note:', error)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="bg-white/50 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-xl border border-white/60"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <motion.div 
          className="text-center mb-8"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 text-transparent bg-clip-text">
            Our Notes
          </h2>
          <motion.p 
            className="mt-4 text-xl text-pink-600/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Write your sweet thoughts here 💌
          </motion.p>
        </motion.div>

        {/* New Note Input with Toggle Switch */}
        <div className="mb-8">
          <div className="flex justify-center items-center mb-4">
            <span className={`mr-3 font-medium ${author === 'koko' ? 'text-purple-600' : 'text-purple-400'}`}>
              Koko
            </span>
            <div 
              className="relative w-16 h-8 flex items-center cursor-pointer"
              onClick={() => setAuthor(prev => prev === 'koko' ? 'babe' : 'koko')}
            >
              <div className="w-full h-6 bg-white/80 rounded-full border-2 border-pink-200 shadow-inner" />
              <motion.div 
                className="absolute w-7 h-7 bg-pink-500 rounded-full shadow-md"
                animate={{ 
                  x: author === 'koko' ? 0 : 36,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
            <span className={`ml-3 font-medium ${author === 'babe' ? 'text-pink-600' : 'text-pink-400'}`}>
              Babe
            </span>
          </div>
          <div className="relative">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Write a sweet note as ${author === 'koko' ? 'Koko' : 'Babe'}...`}
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-pink-100 
                       focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent
                       placeholder-pink-300 text-pink-600 resize-none h-24"
              style={{ maxWidth: '30rem' }}
            />
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
              <motion.button
                className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                           border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all text-sm sm:text-base"
                onClick={addNote}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Note 💝
              </motion.button>
            </div>
          </div>
        </div>

        {/* Notes List with Author Indicator */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
              {...bind(note.id)}
            >
              <motion.div
                className={`note-content bg-white/90 rounded-xl p-4 shadow-md border
                           ${note.author === 'koko' 
                             ? 'border-purple-100' 
                             : 'border-pink-100'}`}
                style={{ maxWidth: '30rem' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                                  ${note.author === 'koko'
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'bg-pink-100 text-pink-600'}`}>
                    {note.author === 'koko' ? 'Koko' : 'Babe'}
                  </span>
                </div>
                {editingNote === note.id ? (
                  <div className="relative">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/80 border border-pink-100 
                               focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent
                               text-pink-600 resize-none h-20"
                      style={{ maxWidth: '100%' }}
                      autoFocus
                    />
                    <div className="flex justify-end gap-1.5 sm:gap-2 mt-2">
                      <motion.button
                        onClick={() => setEditingNote(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 sm:p-2 rounded-full bg-pink-500 text-white shadow-lg 
                                   hover:bg-pink-600 transition-all
                                   flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        onClick={saveEdit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 sm:p-2 rounded-full bg-pink-500 text-white shadow-lg 
                                   hover:bg-pink-600 transition-all
                                   flex items-center justify-center"
                      >
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div style={{ maxWidth: '28rem' }}>
                    <p className={`mb-2 whitespace-pre-wrap text-justify
                                 ${note.author === 'koko' 
                                   ? 'text-purple-600' 
                                   : 'text-pink-600'}`}
                       style={{ 
                         wordBreak: 'break-word',
                         overflowWrap: 'break-word'
                       }}>
                      {note.content}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-pink-400">
                  <span>{note.date}</span>
                  <Heart size={16} className="fill-current" />
                </div>
              </motion.div>

              {/* Context Menu */}
              <AnimatePresence>
                {selectedNote === note.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="note-menu absolute right-2 top-2 flex gap-1.5 sm:gap-2 bg-white/90 
                             rounded-full shadow-lg border border-pink-100 p-1 sm:p-1.5"
                  >
                    <motion.button
                      onClick={() => handleEdit(note)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 sm:p-2 rounded-full bg-pink-500 text-white shadow-lg 
                                 hover:bg-pink-600 transition-all
                                 flex items-center justify-center"
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(note.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 sm:p-2 rounded-full bg-pink-500 text-white shadow-lg 
                                 hover:bg-pink-600 transition-all
                                 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 