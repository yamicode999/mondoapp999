import { useState, useEffect } from 'react'
import { toZonedTime } from 'date-fns-tz';
import { motion } from 'framer-motion'

interface TimeLeft {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isCountingForward, setIsCountingForward] = useState(false)
  const [isOverMonth, setIsOverMonth] = useState(false)

useEffect(() => {
  const targetDate = new Date('2025-07-01T00:00:00+09:00'); // Original date in Tokyo time
  const targetInTokyo = toZonedTime(targetDate, 'Asia/Tokyo');

  const calculateTime = () => {
    const now = new Date();
    const tokyoNow = toZonedTime(now, 'Asia/Tokyo');

    const isCountingDown = tokyoNow < targetInTokyo;
    setIsCountingForward(!isCountingDown);

    let years, months, days, hours, minutes, seconds;

    if (isCountingDown) {
      // Counting Down Mode (Target Date in the Future)
      const timeDiff = targetInTokyo.getTime() - tokyoNow.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      // If more than 31 days, definitely over a month
      if (daysDiff > 31) {
        setIsOverMonth(true);
        
        // Calculate dates for month difference
        const tempDate = new Date(tokyoNow.getTime() + timeDiff);
        years = tempDate.getFullYear() - tokyoNow.getFullYear();
        months = tempDate.getMonth() - tokyoNow.getMonth();
        
        // Get the last day of current month
        const currentMonthLastDay = new Date(tokyoNow.getFullYear(), tokyoNow.getMonth() + 1, 0).getDate();
        
        // Calculate days considering month end
        if (tempDate.getDate() >= tokyoNow.getDate()) {
          days = tempDate.getDate() - tokyoNow.getDate();
        } else {
          months--;
          if (months < 0) {
            years--;
            months += 12;
          }
          days = currentMonthLastDay - tokyoNow.getDate() + tempDate.getDate();
        }
        
        // Calculate time components
        hours = tempDate.getHours() - tokyoNow.getHours();
        minutes = tempDate.getMinutes() - tokyoNow.getMinutes();
        seconds = tempDate.getSeconds() - tokyoNow.getSeconds();

        // Handle negative time components
        if (seconds < 0) {
          minutes--;
          seconds += 60;
        }
        if (minutes < 0) {
          hours--;
          minutes += 60;
        }
        if (hours < 0) {
          if (days > 0) {
            days--;
            hours += 24;
          } else if (months > 0) {
            months--;
            days = currentMonthLastDay - 1;
            hours += 24;
          }
        }
      } else {
        setIsOverMonth(false);
        days = daysDiff;
        hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        years = 0;
        months = 0;
      }
    } else {
      // Counting Forward Mode (Target Date Passed)
      const timeDiff = tokyoNow.getTime() - targetInTokyo.getTime();
      
      if (timeDiff >= 24 * 60 * 60 * 1000) {
        years = tokyoNow.getFullYear() - targetInTokyo.getFullYear();
        months = tokyoNow.getMonth() - targetInTokyo.getMonth();
        days = tokyoNow.getDate() - targetInTokyo.getDate();
        
        if (days < 0) {
          months--;
          const lastMonth = new Date(tokyoNow.getFullYear(), tokyoNow.getMonth(), 0);
          days = lastMonth.getDate() + days;
        }
        if (months < 0) {
          years--;
          months += 12;
        }
      } else {
        years = 0;
        months = 0;
        days = 0;
      }

      hours = tokyoNow.getHours();
      minutes = tokyoNow.getMinutes();
      seconds = tokyoNow.getSeconds();
    }

    setTimeLeft({ 
      years: years || 0,
      months: months || 0,
      days: days || 0,
      hours: hours || 0,
      minutes: minutes || 0,
      seconds: seconds || 0
    });
  };

  calculateTime();
  const timer = setInterval(calculateTime, 1000);

  return () => clearInterval(timer);
}, []);                

  const timeBlocks = isCountingForward
    ? [
        { label: 'Years', value: timeLeft.years },
        { label: 'Months', value: timeLeft.months },
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
      ]
    : isOverMonth
    ? [
        { label: 'Months', value: timeLeft.months },
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes }
      ]
    : [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
      ]

  return (
    <div className={`grid ${isCountingForward ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
      {timeBlocks.map(({ label, value }, index) => (
        <motion.div
          key={label}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <motion.div
            className="bg-white/90 rounded-2xl p-4 shadow-lg border border-pink-100/80 relative overflow-hidden"
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
                className={`block ${isCountingForward ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-bold text-indigo-600 mb-1`}
                key={value}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {value.toString().padStart(2, '0')}
              </motion.span>
              <span className="block text-xs font-medium text-pink-600/80 uppercase tracking-wider">
                {label}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
