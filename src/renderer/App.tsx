import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ErrorBoundary } from '@/components/error-boundary'
import { SettingsPanel } from '@/components/settings-panel'
import { FloatingCloseButton } from '@/components/custom-header'

interface AppProps {}

function App({}: AppProps) {
  return (
    <ErrorBoundary>
      {/* Completely transparent background, draggable */}
      <div className="te-draggable-area">
        {/* Main Panel with relative positioning for close button */}
        <main className="te-container te-no-drag">
          {/* Floating close button in top-right corner of container */}
          <FloatingCloseButton />
          
          <Suspense fallback={
            <div className="flex justify-center py-12">
              <div className="te-spinner" />
            </div>
          }>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SettingsPanel />
            </motion.div>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App 