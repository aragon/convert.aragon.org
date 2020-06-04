import env from './environment'

import tokenAbi from './abi/token.json'
import bancorAbi from './abi/bancor.json'
import fundraisingAbi from './abi/fundraising.json'

const KNOWN_CONTRACTS_BY_ENV = new Map([
  [
    '1',
    {
      BANCOR_FORMULA: '0x274Aac49b63F07Bf6998964aD20020b18383a09D',
      BONDING_CURVE_TREASURY: '0xEc0DD1579551964703246BeCfbF199C27Cb84485',
      FUNDRAISING: '0x0b4D742d52EE0C4391439f80822B26fDF1ad6Ee7',
      MARKET_MAKER: '0x5D9DbF55aF65498FaA84BDD4dDe37f7F3f8c7af1',
      TOKEN_ANT: '0x960b236A07cf122663c4303350609A66A7B288C0',
      TOKEN_ANJ: '0xcD62b1C403fa761BAadFC74C525ce2B51780b184',
    },
  ],
  [
    '4',
    {
      BANCOR_FORMULA: '0x9ac140F489Df1481C20FeB318f09b29A4f744915',
      BONDING_CURVE_TREASURY: '0xEdf4C05D31ea053C69E065b2F6744DA8B76258b3',
      FUNDRAISING: '0x8Ab84819C08355B029CDa21457192d0d249bCC0d',
      MARKET_MAKER: '0xb9aB1Cc6AdC7c3bacc4ea26235838497abe865e0',
      TOKEN_ANT: '0x8cf8196c14A654dc8Aceb3cbb3dDdfd16C2b652D',
      TOKEN_ANJ: '0x1FAB7d0D028ded72195322998003F6e82cF4cFdB',
    },
  ],
])

const ABIS = new Map([
  ['TOKEN_ANT', tokenAbi],
  ['TOKEN_ANJ', tokenAbi],
  ['BANCOR_FORMULA', bancorAbi],
  ['FUNDRAISING', fundraisingAbi],
])

export function getKnownContract(name) {
  const knownContracts = KNOWN_CONTRACTS_BY_ENV.get(env('CHAIN_ID')) || {}
  return [knownContracts[name] || null, ABIS.get(name) || []]
}

export default KNOWN_CONTRACTS_BY_ENV
