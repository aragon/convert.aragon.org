import React, { useMemo } from 'react'
import { formatUnits } from 'lib/web3-utils'
import 'styled-components/macro'

function Balance({ tokenAmountToConvert, tokenBalance }) {
  const balanceError = useMemo(
    () =>
      tokenAmountToConvert.gt(tokenBalance) &&
      !tokenAmountToConvert.eq(-1) &&
      !tokenBalance.eq(-1),
    [tokenAmountToConvert, tokenBalance]
  )

  return !tokenBalance.eq(-1) ? (
    <div
      css={`
        text-align: center;
        font-family: 'Manrope', 'Calibre', sans-serif;
        color: ${balanceError ? '#FF7163' : 'white'};
        background: ${balanceError
          ? 'rgba(255, 255, 255, 0.7)'
          : 'transparent'};
        padding: 0 12px 0 12px;
      `}
    >
      {balanceError ? 'Insufficient balance' : 'Balance'}:{' '}
      {formatUnits(tokenBalance, { truncateToDecimalPlace: 3 })}
    </div>
  ) : null
}

export default Balance
