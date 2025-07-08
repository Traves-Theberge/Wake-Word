import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {}

export function AnimatedBackground({}: AnimatedBackgroundProps) {
  const orbs = [
    {
      id: 1,
      size: 'w-64 h-64',
      color: 'bg-neon-gold',
      position: 'top-1/4 left-1/4',
      delay: 0
    },
    {
      id: 2,
      size: 'w-48 h-48',
      color: 'bg-neon-teal',
      position: 'bottom-1/4 right-1/4',
      delay: 1000
    },
    {
      id: 3,
      size: 'w-32 h-32',
      color: 'bg-neon-green',
      position: 'top-3/4 left-3/4',
      delay: 2000
    },
    {
      id: 4,
      size: 'w-40 h-40',
      color: 'bg-neon-purple',
      position: 'top-1/2 right-1/3',
      delay: 1500
    }
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`
            absolute ${orb.size} ${orb.color} ${orb.position}
            opacity-5 rounded-full blur-3xl
          `}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay / 1000
          }}
        />
      ))}
    </div>
  )
} 