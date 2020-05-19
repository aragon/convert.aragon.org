import React from 'react'
import * as Sentry from '@sentry/browser'
import NextHead from 'next/head'
import { useSpring, animated } from 'react-spring'
import { createGlobalStyle } from 'styled-components'
import { ViewportProvider } from 'use-viewport'
import { Web3ConnectProvider } from 'lib/wallet'
import env from 'lib/environment'

if (env('SENTRY_DSN')) {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    environment: env('NODE_ENV'),
    release: 'convert.aragon.org@' + env('BUILD'),
  })
}

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Manrope';
    src: url('/fonts/ManropeGX.ttf');
  }
  body,
  button {
    font-family: 'Manrope', sans-serif;
  }
  body,
  html {
    margin: 0;
    padding: 0;
    overflow-y: hidden;
    font-size: 16px;
  }
`

export default function App({ Component, pageProps }) {
  const revealProps = useSpring({
    from: { opacity: 0, transform: 'scale3d(0.98, 0.98, 1)' },
    to: { opacity: 1, transform: 'scale3d(1, 1, 1)' },
  })

  return (
    <ViewportProvider>
      <animated.div style={revealProps}>
        <NextHead>
          <title>Aragon Converter</title>
        </NextHead>
        <GlobalStyles />
        <Web3ConnectProvider>
          <Component {...pageProps} />
        </Web3ConnectProvider>
      </animated.div>
    </ViewportProvider>
  )
}
