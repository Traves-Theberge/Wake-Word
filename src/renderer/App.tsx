import { ErrorBoundary } from '@/components/error-boundary'
import { SettingsPanel } from '@/components/settings-panel'

interface AppProps {}

function App({}: AppProps) {
  return (
    <ErrorBoundary>
      <div className="te-app">
        <SettingsPanel />
      </div>
    </ErrorBoundary>
  )
}

export default App 