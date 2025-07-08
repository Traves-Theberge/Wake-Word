import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'gold' | 'teal' | 'green'
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'gold' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    gold: 'border-neon-gold/30 border-t-neon-gold',
    teal: 'border-neon-teal/30 border-t-neon-teal',
    green: 'border-neon-green/30 border-t-neon-green'
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2 rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )
} 