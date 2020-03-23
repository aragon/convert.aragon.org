import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Router } from 'components/Router'
import Navbar from 'components/Navbar'
import { Web3ConnectProvider } from './web3-connect'

import './app.css'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
    <Web3ConnectProvider>
      <Root>
        <Navbar />
        <div className="content">
          <React.Suspense fallback={<em>Loading…</em>}>
            <Router>
              <Routes path="*" />
            </Router>
          </React.Suspense>
        </div>
      </Root>
    </Web3ConnectProvider>
  )
}

export default App
