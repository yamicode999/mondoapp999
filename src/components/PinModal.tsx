import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MoreVertical } from 'lucide-react'
import Lottie from 'lottie-react'
import { verifyPin, updateSecurityPin } from '../firebase/config'
import angrycat1 from '../assets/angry-cat1.json'
import angrycat2 from '../assets/angry-cat2.json'
import angrycat3 from '../assets/angry-cat3.json'
import angrycat4 from '../assets/angry-cat4.json'

interface PinModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PinInput = ({ value, onChange, error, onKeyDown }: {
  value: string
  onChange: (value: string) => void
  error: boolean
  onKeyDown: (e: React.KeyboardEvent) => void
}) => {
  const hearts = Array(4).fill('💗')
  const filledHearts = hearts.map((heart, i) => (
    <span key={i} className={`transition-opacity ${i < value.length ? 'opacity-100' : 'opacity-30'}`}>
      {heart}
    </span>
  ))

  return (
    <div className="relative">
      <div className={`w-full text-center text-2xl p-3 rounded-lg border-2
        ${error ? 'border-red-300' : 'border-pink-300'} 
        focus-within:border-pink-500`}
      >
        <div className="text-pink-500 flex justify-center gap-2">
          {filledHearts}
        </div>
        <input
          type="password"
          maxLength={4}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          onKeyDown={onKeyDown}
          className="opacity-0 absolute inset-0 w-full text-center"
          autoFocus
        />
      </div>
    </div>
  )
}

export function PinModal({ isOpen, onClose, onSuccess }: PinModalProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isChangingPin, setIsChangingPin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [changePinStep, setChangePinStep] = useState<'current' | 'new' | 'confirm'>('current')
  const [changePinError, setChangePinError] = useState('')
  const settingsRef = useRef<HTMLDivElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const [currentAnimation, setCurrentAnimation] = useState(angrycat1)
  
  const angryCats = [angrycat1, angrycat2, angrycat3, angrycat4]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSettings && 
          settingsRef.current && 
          !settingsRef.current.contains(event.target as Node) &&
          settingsButtonRef.current &&
          !settingsButtonRef.current.contains(event.target as Node)) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettings])

  const handleAnimationClick = () => {
    const randomIndex = Math.floor(Math.random() * angryCats.length)
    setCurrentAnimation(angryCats[randomIndex] as any)
  }

  const handleSubmit = async () => {
    const isValid = await verifyPin(pin)
    if (isValid) {
      onSuccess()
      setPin('')
      setError(false)
    } else {
      setError(true)
      setPin('')
    }
  }

  const handleChangePinSubmit = async () => {
    if (changePinStep === 'current') {
      const isValid = await verifyPin(pin)
      if (isValid) {
        setChangePinStep('new')
        setPin('')
        setChangePinError('')
      } else {
        setChangePinError('Incorrect current PIN')
        setPin('')
      }
    } else if (changePinStep === 'new') {
      if (pin.length === 4) {
        setNewPin(pin)
        setChangePinStep('confirm')
        setPin('')
        setChangePinError('')
      }
    } else if (changePinStep === 'confirm') {
      if (pin === newPin) {
        try {
          await updateSecurityPin(pin)
          setIsChangingPin(false)
          setShowSettings(false)
          setChangePinStep('current')
          setPin('')
          setNewPin('')
          setChangePinError('')
        } catch (error) {
          setChangePinError('Failed to update PIN. Please try again.')
          console.error('Error updating PIN:', error)
        }
      } else {
        setChangePinError('PINs do not match')
        setPin('')
      }
    }
  }

  const getTitle = () => {
    if (!isChangingPin) return 'Enter PIN'
    if (changePinStep === 'current') return 'Enter Current PIN'
    if (changePinStep === 'new') return 'Enter New PIN'
    return 'Confirm New PIN'
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      if (isChangingPin) {
        handleChangePinSubmit()
      } else {
        handleSubmit()
      }
    }
  }

  const handlePinChange = (value: string) => {
    setPin(value)
    setChangePinError('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                     flex flex-col items-center justify-center gap-4 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-8 w-[90%] max-w-sm relative overflow-hidden bg-transparent"
          >
            <div className="relative z-10">
              {!error ? (
                <>
                  <h3 className="text-4xl font-dancing font-extrabold mb-4 text-center drop-shadow-lg 
                               text-pink-300">
                    To My Dearest Love
                  </h3>
                  <p className="text-2xl text-pink-300 font-bold italic font-dancing leading-relaxed text-center 
                               drop-shadow-lg tracking-wide">
                    You light up my world in ways I never imagined.<br />
                    No matter where we are, my heart will always find its way to yours.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-4xl font-dancing font-extrabold mb-4 text-center drop-shadow-lg 
                               text-pink-300">
                    Why did you forget the PIN???
                  </h3>
                  <div 
                    className="w-48 h-48 mx-auto cursor-pointer" 
                    onClick={handleAnimationClick}
                  >
                    <Lottie
                      animationData={currentAnimation}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-[90%] max-w-sm relative shadow-lg"
          >
            <div className="absolute right-4 top-4">
              {!isChangingPin && (
                <motion.button
                  ref={settingsButtonRef}
                  onClick={() => setShowSettings(true)}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                             border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-center mb-4 text-pink-500">
              {getTitle()}
            </h2>
            
            <PinInput
              value={pin}
              onChange={handlePinChange}
              error={error || !!changePinError}
              onKeyDown={handleKeyDown}
            />
            
            {(error || changePinError) && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center mt-2"
              >
                {changePinError || 'Incorrect PIN. Please try again.'}
              </motion.p>
            )}
            
            <div className="flex justify-center gap-2 sm:gap-4 mt-4">
              <motion.button
                className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                           border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all text-sm sm:text-base"
                onClick={() => {
                  onClose()
                  setIsChangingPin(false)
                  setChangePinStep('current')
                  setPin('')
                  setNewPin('')
                  setChangePinError('')
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/80 text-pink-500 shadow-lg 
                           border border-pink-100/50 hover:bg-white hover:shadow-xl transition-all text-sm sm:text-base"
                onClick={isChangingPin ? handleChangePinSubmit : handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isChangingPin ? (changePinStep === 'confirm' ? 'Confirm' : 'Next') : 'Submit'}
              </motion.button>
            </div>
            
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  ref={settingsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-4 top-16 bg-white rounded-lg shadow-lg border border-pink-300 p-2 min-w-[140px]"
                >
                  <button
                    onClick={() => {
                      setIsChangingPin(true)
                      setShowSettings(false)
                      setPin('')
                      setChangePinStep('current')
                    }}
                    className="w-full px-3 py-2 text-sm text-white bg-pink-500
                              hover:bg-pink-600 rounded-md transition-colors"
                  >
                    Change PIN
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
