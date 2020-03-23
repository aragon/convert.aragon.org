import React from 'react'
import styled from 'styled-components'
import Token from './Token'
import { useWeb3Connect } from 'lib/web3-connect'
import { formatUnits } from 'lib/web3-utils'
import {
  useJurorRegistryAnjBalance,
  useTokenDecimals,
} from 'lib/web3-contracts'

function Balance() {
  const { account } = useWeb3Connect()
  const anjBalance = useJurorRegistryAnjBalance()
  const anjDecimals = useTokenDecimals('ANJ')

  return (
    <BalanceSection>
      <p>Your account’s active balance</p>
      <h3>
        <span className="mono">
          {(account &&
            formatUnits(anjBalance, {
              digits: anjDecimals,
              truncateToDecimalPlace: 3,
            })) ||
            '0.00'}
        </span>{' '}
        <Token symbol="ANJ" />
      </h3>
    </BalanceSection>
  )
}

const BalanceSection = styled.div`
  h3 {
    font-size: 54px;
    line-height: 38px;
    display: flex;
    align-items: baseline;
    color: #1c1c1c;
  }
  h3 span.mono {
    font-family: 'FontMono';
    letter-spacing: -3px;
  }
`

export default Balance
