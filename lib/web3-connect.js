import React, { useCallback } from 'react'
import { providers as EthersProviders } from 'ethers'
import {
  UnsupportedChainIdError,
  Web3ReactProvider,
  useWeb3React,
} from '@web3-react/core'
import {
  InjectedConnector,
  // NoEthereumProviderError as InjectedNoEthereumProviderError,
  // UserRejectedRequestError as InjectedUserRejectedRequestError,
} from '@web3-react/injected-connector'
import {
  FrameConnector,
  // UserRejectedRequestError as FrameUserRejectedRequestError,
} from '@web3-react/frame-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import env from './environment'
import { getNetworkName } from './web3-utils'

const { Web3Provider: EthersWeb3Provider } = EthersProviders

const CHAIN_ID = Number(env('CHAIN_ID'))

const WEB3_REACT_CONNECTORS = new Map([
  ['injected', new InjectedConnector({ supportedChainIds: [CHAIN_ID] })],
  ['frame', new FrameConnector({ supportedChainIds: [CHAIN_ID] })],
])

if (env('FORTMATIC_API_KEY')) {
  WEB3_REACT_CONNECTORS.set(
    'fortmatic',
    new FortmaticConnector({
      apiKey: env('FORTMATIC_API_KEY'),
      chainId: CHAIN_ID,
    })
  )
}

if (env('PORTIS_DAPP_ID')) {
  WEB3_REACT_CONNECTORS.set(
    'portis',
    new PortisConnector({
      dAppId: env('PORTIS_DAPP_ID'),
      networks: [CHAIN_ID],
    })
  )
}

function logError(err, ...messages) {
  if (typeof window !== 'undefined') {
    window.alert(messages.join(' '))
  }
  console.error(...messages, err)
}

export function useWeb3Connect() {
  const web3ReactContext = useWeb3React()

  const activate = useCallback(
    async type => {
      const connector = WEB3_REACT_CONNECTORS.get(type)

      if (!connector) {
        return false
      }

      try {
        await web3ReactContext.activate(connector, null, true)
        return true
      } catch (err) {
        if (err instanceof UnsupportedChainIdError) {
          logError(
            err,
            `Unsupported chain: please connect to the network called ${getNetworkName(
              CHAIN_ID
            )} in your Ethereum Provider.`
          )
          return
        }

        logError(
          err,
          'An error happened while trying to activate the wallet, please try again.'
        )
      }
    },
    [web3ReactContext]
  )

  const {
    chainId,
    account,
    library: ethersProvider,
    deactivate,
  } = web3ReactContext

  return {
    account,
    activate,
    connectors: WEB3_REACT_CONNECTORS,
    deactivate,
    ethersProvider,
    networkName: getNetworkName(chainId),
    web3ReactContext,
  }
}

export function Web3ConnectProvider({ children }) {
  const getLibrary = useCallback(
    provider => new EthersWeb3Provider(provider),
    []
  )
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  )
}
