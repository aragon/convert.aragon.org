import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import * as Sentry from '@sentry/browser'
import env from './environment'

// Your top level component
import App from './App'

// Export your top level component as JSX (for static rendering)
export default App

if (env('SENTRY_DSN')) {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    environment: env('NODE_ENV'),
    release: 'anj.aragon.org@' + env('BUILD'),
  })
}

// Render your app
if (typeof document !== 'undefined') {
  const target = document.getElementById('root')

  const renderMethod = target.hasChildNodes()
    ? ReactDOM.hydrate
    : ReactDOM.render

  const render = Comp => {
    renderMethod(
      <AppContainer>
        <Comp />
      </AppContainer>,
      target
    )
  }

  // Render!
  render(App)

  // Hot Module Replacement
  if (module && module.hot) {
    module.hot.accept('./App', () => {
      render(App)
    })
  }
}
