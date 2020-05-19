import React, { useCallback, useMemo } from 'react'
import { UnsupportedChainError, UseWalletProvider, useWallet } from 'use-wallet'
import env from './environment'
import { getNetworkName } from './web3-utils'
import { providers } from 'ethers'
import { trackEvent } from 'lib/analytics'

const CHAIN_ID = Number(env('CHAIN_ID'))

function logError(err, ...messages) {
  if (typeof window !== 'undefined') {
    window.alert(messages.join(' '))
  }
  console.error(...messages, err)
}

export function useWeb3Connect() {
  const { activate, ethereum, deactivate, account } = useWallet()

  const ethers = useMemo(
    () => (ethereum ? new providers.Web3Provider(ethereum) : null),
    [ethereum]
  )

  const augmentedActivate = useCallback(
    async type => {
      try {
        await activate(type)

        trackEvent('web3_connect', {
          segmentation: {
            provider: type,
          },
        })

        return true
      } catch (error) {
        if (error instanceof UnsupportedChainError) {
          logError(
            error,
            `Unsupported chain: please connect to the network called ${getNetworkName(
              CHAIN_ID
            )} in your Ethereum Provider.`
          )

          return
        }

        logError(
          error,
          'An error happened while trying to activate the wallet, please try again.'
        )
      }
    },
    [activate]
  )

  return {
    activate: augmentedActivate,
    account,
    deactivate,
    ethersProvider: ethers,
    networkName: getNetworkName(CHAIN_ID),
  }
}

export function Web3ConnectProvider({ children }) {
  return (
    <UseWalletProvider
      chainId={CHAIN_ID}
      connectors={{
        fortmatic: { apiKey: env('PORTIS_DAPP_ID') },
        portis: { dAppId: env('FORTMATIC_API_KEY') },
      }}
    >
      {children}
    </UseWalletProvider>
  )
}
