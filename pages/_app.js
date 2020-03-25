import React from 'react'
import * as Sentry from '@sentry/browser'
import App from 'next/app'
import Head from 'next/head'
import { createGlobalStyle } from 'styled-components'
import Navbar from 'components/Navbar'
import { Web3ConnectProvider } from 'lib/web3-connect'
import env from 'lib/environment'

if (env('SENTRY_DSN')) {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    environment: env('NODE_ENV'),
    release: 'anj.aragon.org@' + env('BUILD'),
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

export default class extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Aragon Court</title>
        </Head>
        <GlobalStyles />
        <Web3ConnectProvider>
          <Component {...pageProps} />
        </Web3ConnectProvider>
      </>
    )
  }
}
