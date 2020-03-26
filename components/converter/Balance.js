import React from 'react'
import styled from 'styled-components/macro'
import Token from './Token'
import { useTokenBalance, useTokenDecimals } from '../../lib/web3-contracts'
import { formatUnits } from '../../lib/web3-utils'

function Balance() {
  const anjBalance = useTokenBalance('ANJ')
  const anjDecimals = useTokenDecimals('ANJ')

  return (
    <BalanceSection>
      <p>Your account’s active balance</p>
      <h3>
        <span className="mono">
          {anjBalance.eq(-1)
            ? '0'
            : formatUnits(anjBalance, {
                digits: anjDecimals,
                replaceZeroBy: '0',
                truncateToDecimalPlace: 2,
              })}{' '}
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
    font-family: monospace;
    letter-spacing: -3px;
  }
`

export default Balance
