import React from 'react'
import { shortenAddress } from 'lib/web3-utils'

function TransactionBadge({ transactionHash }) {
  return (
    <div
      css={`
        display: inline;
        background: #ebfafd;
        color: black;
        border-radius: 3px;
        padding: 4px 8px;
        font-size: 20px;
        line-height: 21px;
      `}
    >
        <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" css={`color: black;`}>
        {' '}
        {shortenAddress(transactionHash)}
      </a>
    </div>
  )
}

export default TransactionBadge
