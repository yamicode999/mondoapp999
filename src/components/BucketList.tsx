import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Trash2, Star, Pencil, X } from 'lucide-react'
import { useLongPress } from 'use-long-press'
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

interface BucketItem {
  id: string
  content: string
  completed: boolean
  date: string
  checkedDate?: string
  checkedTimestamp?: string
}

export function BucketList() {
  const [items, setItems] = useState<BucketItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [itemToUncheck, setItemToUncheck] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'bucketList'), orderBy('timestamp', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let itemsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: new Date(data.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          checkedDate: data.checkedTimestamp ? new Date(data.checkedTimestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : undefined,
          checkedTimestamp: data.checkedTimestamp || null
        }
      }) as BucketItem[]

      // Sort items: uncompleted first (by added date), then completed (by checked timestamp)
      itemsData = itemsData.sort((a, b) => {
        if (a.completed === b.completed) {
          if (a.completed) {
            // For completed items, sort by checked timestamp
            const aTime = a.checkedTimestamp ? new Date(a.checkedTimestamp).getTime() : 0;
            const bTime = b.checkedTimestamp ? new Date(b.checkedTimestamp).getTime() : 0;
            return bTime - aTime;
          } else {
            // For uncompleted items, sort by added date
            const aTime = new Date(a.date).getTime();
            const bTime = new Date(b.date).getTime();
            return bTime - aTime;
          }
        }
        return a.completed ? 1 : -1;
      });
      
      setItems(itemsData)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedItem) {
        const target = event.target as HTMLElement
        if (!target.closest('.item-menu') && !target.closest('.item-content')) {
          setSelectedItem(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedItem])

  const bind = useLongPress((_, { context }) => {
    const itemId = context as string
    setSelectedItem(itemId)
  }, {
    threshold: 500,
    cancelOnMovement: true
  })

  const handleEdit = (item: BucketItem) => {
    setEditingItem(item.id)
    setEditContent(item.content)
    setSelectedItem(null)
  }

  const saveEdit = async () => {
    if (editingItem && editContent.trim()) {
      try {
        await updateDoc(doc(db, 'bucketList', editingItem), {
          content: editContent.trim()
        })
        setEditingItem(null)
        setEditContent('')
      } catch (error) {
        console.error('Error updating item:', error)
      }
    }
  }

  const addItem = async () => {
    if (newItem.trim()) {
      try {
        await addDoc(collection(db, 'bucketList'), {
          content: newItem.trim(),
          completed: false,
          timestamp: new Date().toISOString()
        })
        setNewItem('')
      } catch (error) {
        console.error('Error adding item:', error)
      }
    }
  }

  const toggleComplete = async (id: string) => {
    try {
      const itemRef = doc(db, 'bucketList', id)
      const item = items.find(i => i.id === id)
      if (item) {
        const now = new Date().toISOString();
        await updateDoc(itemRef, {
          completed: !item.completed,
          checkedTimestamp: !item.completed ? now : null
        })
      }
    } catch (error) {
      console.error('Error toggling complete:', error)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bucketList', id))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleToggleComplete = (id: string, completed: boolean) => {
    if (completed) {
      // Show confirmation when unchecking
      setItemToUncheck(id);
      setShowConfirmModal(true);
    } else {
      // Directly check if not completed
      toggleComplete(id);
    }
  };

  const confirmUncheck = () => {
    if (itemToUncheck) {
      toggleComplete(itemToUncheck);
    }
    setShowConfirmModal(false);
    setItemToUncheck(null);
  };

  return (
    <>
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
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
              Our Bucket List
            </h2>
            <motion.p 
              className="mt-4 text-xl text-purple-600/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Dreams we'll achieve together ⭐
            </motion.p>
          </motion.div>

          {/* New Item Input */}
          <div className="mb-8">
            <div className="relative">
              <textarea
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder="Add a new dream to our list..."
                className="w-full px-4 py-3 rounded-xl bg-white/80 border border-purple-100 
                         focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                         placeholder-purple-300 text-purple-600 resize-none h-20"
                style={{ 
                  maxWidth: '30rem',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              />
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
                <motion.button
                  className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                             border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all text-sm sm:text-base"
                  onClick={addItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Item ✨
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bucket List Items */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
                {...bind(item.id)}
              >
                <motion.div
                  className="item-content bg-white/90 rounded-xl p-4 shadow-md border border-purple-100"
                  style={{ maxWidth: '30rem' }}
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      onClick={() => handleToggleComplete(item.id, item.completed)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-1.5 sm:p-2 rounded-full shadow-lg border transition-all
                                  flex items-center justify-center
                                  ${item.completed 
                                    ? 'bg-white/80 text-purple-500 border-purple-100/50 hover:bg-white hover:shadow-xl' 
                                    : 'bg-white/80 text-purple-500 border-purple-100/50 hover:bg-white hover:shadow-xl'
                                  }`}
                    >
                      {item.completed 
                        ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        : <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      }
                    </motion.button>
                    <div className="flex-1 min-w-0">
                      {editingItem === item.id ? (
                        <div className="relative">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/80 border border-purple-100 
                                     focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                                     text-purple-600 resize-none h-20"
                            style={{ maxWidth: '100%' }}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5 sm:gap-2 mt-2">
                            <motion.button
                              onClick={() => setEditingItem(null)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1.5 sm:p-2 rounded-full bg-purple-500 text-white shadow-lg 
                                         hover:bg-purple-600 transition-all
                                         flex items-center justify-center"
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.button>
                            <motion.button
                              onClick={saveEdit}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1.5 sm:p-2 rounded-full bg-purple-500 text-white shadow-lg 
                                         hover:bg-purple-600 transition-all
                                         flex items-center justify-center"
                            >
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className={`text-purple-600 break-words whitespace-pre-wrap text-justify
                                         ${item.completed ? 'line-through opacity-70' : ''}`}
                             style={{
                               wordBreak: 'break-word',
                               overflowWrap: 'break-word'
                             }}>
                            {item.content}
                          </p>
                          <div className="text-sm text-purple-400">
                            <span className={item.completed ? 'line-through' : ''}>{item.date}</span>
                            {item.checkedDate && (
                              <span className="ml-2">• {item.checkedDate}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Context Menu */}
                <AnimatePresence>
                  {selectedItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="item-menu absolute right-2 top-2 flex gap-1.5 sm:gap-2 bg-white/90 
                               rounded-full shadow-lg border border-purple-100 p-1 sm:p-1.5"
                    >
                      <motion.button
                        onClick={() => handleEdit(item)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 sm:p-2 rounded-full bg-purple-500 text-white shadow-lg 
                                   hover:bg-purple-600 transition-all
                                   flex items-center justify-center"
                      >
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteItem(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 sm:p-2 rounded-full bg-purple-500 text-white shadow-lg 
                                   hover:bg-purple-600 transition-all
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => {
                setShowConfirmModal(false);
                setItemToUncheck(null);
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-purple-100 max-w-sm w-full mx-4 relative z-10"
            >
              <h3 className="text-xl font-bold text-purple-600 mb-4">
                Uncheck this dream?
              </h3>
              <p className="text-purple-500 mb-6">
                Are you sure you want to mark this dream as incomplete?
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setItemToUncheck(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmUncheck}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
} 
