import { useState, useEffect } from 'react'
import { toZonedTime } from 'date-fns-tz';
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Lottie from 'lottie-react'

// Import all cat animations statically
import cuteCat1 from '../assets/cute-cat1.json'
import cuteCat2 from '../assets/cute-cat2.json'
import cuteCat3 from '../assets/cute-cat3.json'
import cuteCat4 from '../assets/cute-cat4.json'
import cuteCat5 from '../assets/cute-cat5.json'
import cuteCat6 from '../assets/cute-cat6.json'
import cuteCat7 from '../assets/cute-cat7.json'
import cuteCat8 from '../assets/cute-cat8.json'
import cuteCat9 from '../assets/cute-cat9.json'
import cuteCat10 from '../assets/cute-cat10.json'
import cuteCat11 from '../assets/cute-cat11.json'
import cuteCat12 from '../assets/cute-cat12.json'
import cuteCat13 from '../assets/cute-cat13.json'
import cuteCat14 from '../assets/cute-cat14.json'
import cuteCat15 from '../assets/cute-cat15.json'
import cuteCat16 from '../assets/cute-cat16.json'
import cuteCat17 from '../assets/cute-cat17.json'
import cuteCat18 from '../assets/cute-cat18.json'
import cuteCat19 from '../assets/cute-cat19.json'
import cuteCat20 from '../assets/cute-cat20.json'
import cuteCat21 from '../assets/cute-cat21.json'
import cuteCat22 from '../assets/cute-cat22.json'
import cuteCat23 from '../assets/cute-cat23.json'
import cuteCat24 from '../assets/cute-cat24.json'
import cuteCat25 from '../assets/cute-cat25.json'
import cuteCat26 from '../assets/cute-cat26.json'
import cuteCat27 from '../assets/cute-cat27.json'
import cuteCat28 from '../assets/cute-cat28.json'
import cuteCat29 from '../assets/cute-cat29.json'
import cuteCat30 from '../assets/cute-cat30.json'
import cuteCat31 from '../assets/cute-cat31.json'
import cuteCat32 from '../assets/cute-cat32.json'
import cuteCat33 from '../assets/cute-cat33.json'
import cuteCat34 from '../assets/cute-cat34.json'
import cuteCat35 from '../assets/cute-cat35.json'
import cuteCat36 from '../assets/cute-cat36.json'
import cuteCat37 from '../assets/cute-cat37.json'
import cuteCat38 from '../assets/cute-cat38.json'
import cuteCat39 from '../assets/cute-cat39.json'
import cuteCat40 from '../assets/cute-cat40.json'
import cuteCat41 from '../assets/cute-cat41.json'
import cuteCat42 from '../assets/cute-cat42.json'
import cuteCat43 from '../assets/cute-cat43.json'
import cuteCat44 from '../assets/cute-cat44.json'
// ... import other cat animations as needed

// Create a map of all cat animations
const catAnimations = {
  1: cuteCat1,
  2: cuteCat2,
  3: cuteCat3,
  4: cuteCat4,
  5: cuteCat5,
  6: cuteCat6,
  7: cuteCat7,
  8: cuteCat8,
  9: cuteCat9,
  10: cuteCat10,
  11: cuteCat11,
  12: cuteCat12,
  13: cuteCat13,
  14: cuteCat14,
  15: cuteCat15,
  16: cuteCat16,
  17: cuteCat17,
  18: cuteCat18,
  19: cuteCat19,
  20: cuteCat20,
  21: cuteCat21,
  22: cuteCat22,
  23: cuteCat23,
  24: cuteCat24,
  25: cuteCat25,
  26: cuteCat26,
  27: cuteCat27,
  28: cuteCat28,
  29: cuteCat29,
  30: cuteCat30,
  31: cuteCat31,
  32: cuteCat32,
  33: cuteCat33,
  34: cuteCat34,
  35: cuteCat35,
  36: cuteCat36,
  37: cuteCat37,
  38: cuteCat38,
  39: cuteCat39,
  40: cuteCat40,
  41: cuteCat41,
  42: cuteCat42,
  43: cuteCat43,
  44: cuteCat44
}

// Replace dynamic import with static access
const getCatAnimation = (num: number) => {
  return catAnimations[num as keyof typeof catAnimations] || cuteCat1
}

export const BeenTogether = () => {
  const [leftCatAnimation, setLeftCatAnimation] = useState(cuteCat1)
  const [rightCatAnimation, setRightCatAnimation] = useState(cuteCat2)
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Load initial cat animations
  useEffect(() => {
    loadCatAnimation(1, 'left')
    loadCatAnimation(2, 'right')
  }, [])

  // Function to load cat animation
  const loadCatAnimation = (num: number, side: 'left' | 'right') => {
    try {
      const animation = getCatAnimation(num)
      if (side === 'left') {
        setLeftCatAnimation(animation)
      } else {
        setRightCatAnimation(animation)
      }
    } catch (error) {
      console.error(`Failed to load cat animation ${num}:`, error)
      // Fallback to default animations if loading fails
      if (side === 'left') {
        setLeftCatAnimation(cuteCat1)
      } else {
        setRightCatAnimation(cuteCat2)
      }
    }
  }

  // Function to change cat animation randomly
  const changeRandomCat = (side: 'left' | 'right') => {
    const randomNum = Math.floor(Math.random() * 44) + 1 // Random number between 1 and 44
    loadCatAnimation(randomNum, side)
  }

useEffect(() => {
  // Convert start date to Tokyo time
  const startDate = new Date('2023-07-20T00:00:00+09:00');
  const startInTokyo = toZonedTime(startDate, 'Asia/Tokyo');

  const calculateTimeElapsed = () => {
    // Get the current time in UTC, then convert to Tokyo time
    const now = new Date();
    const tokyoNow = toZonedTime(now, 'Asia/Tokyo');

    // Calculate the difference in milliseconds between the two Tokyo times
    const timeDiff = tokyoNow.getTime() - startInTokyo.getTime();
    
    let years, months, days, hours, minutes, seconds;

    // Check if at least one full day has passed
    if (timeDiff >= 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      years = tokyoNow.getFullYear() - startInTokyo.getFullYear();
      months = tokyoNow.getMonth() - startInTokyo.getMonth();
      days = tokyoNow.getDate() - startInTokyo.getDate();

      // Adjust for negative days by moving to the previous month/year if necessary
      if (days < 0) {
        months--;
        const lastMonth = new Date(tokyoNow.getFullYear(), tokyoNow.getMonth(), 0); // Last day of the previous month
        days = lastMonth.getDate() + days;
      }
      if (months < 0) {
        years--;
        months += 12;
      }
    } else {
      // If less than a day has passed, set all to zero except for hours, minutes, and seconds
      years = 0;
      months = 0;
      days = 0;
    }

    // Extract the time components from tokyoNow
    hours = tokyoNow.getHours();
    minutes = tokyoNow.getMinutes();
    seconds = tokyoNow.getSeconds();

    setTimeElapsed({ years, months, days, hours, minutes, seconds });
  };

  calculateTimeElapsed();
  const timer = setInterval(calculateTimeElapsed, 1000);

  return () => clearInterval(timer);
}, []);

  return (
    <div className="max-w-3xl mx-auto h-full flex items-center px-2 sm:px-4">
      <motion.div 
        className="bg-white/50 backdrop-blur-md rounded-3xl p-3 sm:p-4 md:p-6 
                   shadow-xl border border-white/60 w-full"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <motion.div 
          className="text-center mb-4 sm:mb-6"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 text-transparent bg-clip-text">
            Time We've Shared
          </h2>
          <motion.p 
            className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl text-pink-600/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Every second with you is precious 💖
          </motion.p>
        </motion.div>

        <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <motion.div 
            className="w-1/3 min-w-[100px] sm:min-w-[120px] max-w-[150px] sm:max-w-[180px] cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeRandomCat('left')}
          >
            <Lottie
              animationData={leftCatAnimation}
              loop={true}
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                mixBlendMode: 'multiply'
              }}
            />
          </motion.div>

          <div className="flex-shrink-0">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-500 animate-pulse" />
          </div>

          <motion.div 
            className="w-1/3 min-w-[100px] sm:min-w-[120px] max-w-[150px] sm:max-w-[180px] cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeRandomCat('right')}
          >
            <Lottie
              animationData={rightCatAnimation}
              loop={true}
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                mixBlendMode: 'multiply'
              }}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Years', value: timeElapsed.years },
            { label: 'Months', value: timeElapsed.months },
            { label: 'Days', value: timeElapsed.days },
            { label: 'Hours', value: timeElapsed.hours },
            { label: 'Minutes', value: timeElapsed.minutes },
            { label: 'Seconds', value: timeElapsed.seconds }
          ].map(({ label, value }, index) => (
            <motion.div
              key={label}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="bg-white/90 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg border border-pink-100/80 relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-50 opacity-50"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="relative">
                  <motion.span 
                    className="block text-xl sm:text-2xl md:text-3xl font-bold text-rose-600 mb-0.5 sm:mb-1"
                    key={value}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {value.toString().padStart(2, '0')}
                  </motion.span>
                  <span className="block text-[10px] sm:text-xs font-medium text-pink-600/80 uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center space-y-1 sm:space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="max-w-[30rem] mx-auto">
            <p className="text-base sm:text-lg text-pink-600/90 font-medium italic break-words whitespace-pre-wrap">
              "Koko is always here—to love you, care for you, and support you unconditionally." 
            </p>
          </div>
          <div className="flex justify-center space-x-2 text-xl sm:text-2xl">
            <motion.span 
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="cursor-pointer"
            >
              🐱
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.2, rotate: -10 }}
              className="cursor-pointer"
            >
              💞
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="cursor-pointer"
            >
              🐈
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 
