import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import { Router } from 'components/Router'
import Navbar from 'components/Navbar'
import { Web3ConnectProvider } from '../lib/web3-connect'

import '../public/app.css'

export default class extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <title>Aragon Court</title>
        </Head>
        <Web3ConnectProvider>
          <Navbar />
          <div>
            <Component {...pageProps} />
          </div>
        </Web3ConnectProvider>
      </>
    )
  }
}
