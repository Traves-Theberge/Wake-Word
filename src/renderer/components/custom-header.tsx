import React from 'react'
import { motion } from 'framer-motion'

// Mock IPC for development - will be replaced with actual Electron IPC
const mockIPC = {
  invoke: async (channel: string, ...args: any[]): Promise<any> => {
    console.log(`IPC Invoke: ${channel}`, args)
    return { success: true }
  }
}

// Use mock IPC if window.electronAPI is not available (development)
const ipc = (window as any).electronAPI || mockIPC

export const FloatingCloseButton: React.FC = () => {
  const handleClose = async () => {
    try {
      await ipc.invoke('window-close')
    } catch (error) {
      console.error('Failed to close window:', error)
    }
  }

  return (
    <motion.button 
      className="te-floating-close-button"
      onClick={handleClose}
      title="Close"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.button>
  )
} 