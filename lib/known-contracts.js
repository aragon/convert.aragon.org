import env from './environment'

import tokenAbi from './abi/token.json'
import ercTokenAbi from './abi/erctoken.json'
import jurorsRegistryAbi from './abi/jurors-registry.json'
import wrapperAbi from './abi/wrapper.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_ANJ: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
      TOKEN_DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      TOKEN_USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      WRAPPER: '0x0EbDB778b88D73B2C513B53849724d8F30363Cc2',
      JURORS_REGISTRY: '0x0F7471C1df2021fF45f112878F755aAbe7AA16bF',
    },
  ],
  [
    '4',
    {
      TOKEN_ANT: '0xbf932fdf8d600398d64614ef9a10401ff046f449',
      TOKEN_ANJ: '0x929F3B27a22a7A56FC8d89617033D22e53840aC9',
      TOKEN_DAI: '0x55Ab9B236CDC9e2CecBD41ADa45D8261f8A6049b',
      TOKEN_USDC: '0xB9DE9Fa099E1415B491ed6072B4F947955e6B596',
      WRAPPER: '0xF880B3Bb00b5aBD0d13743F47d0586a027662662',
      JURORS_REGISTRY: '0x13474160a55a4579B9fE79e6aF8E28727516098A',
    },
  ],
])

const ABIS = new Map([
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_ANJ', tokenAbi],
  ['TOKEN_DAI', ercTokenAbi],
  ['TOKEN_USDC', ercTokenAbi],
  ['JURORS_REGISTRY', jurorsRegistryAbi],
  ['WRAPPER', wrapperAbi],
])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
