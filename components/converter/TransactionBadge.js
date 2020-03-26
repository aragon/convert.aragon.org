import React from 'react'
import PropTypes from 'prop-types'
import environment from 'lib/environment'
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
        line-height: 20px;
      `}
    >
      <a
        href={getEtherscanHref(transactionHash)}
        target="_blank"
        rel="noopener noreferrer"
        css={`
          color: black;
        `}
      >
        {' '}
        {shortenAddress(transactionHash)}
      </a>
    </div>
  )
}

TransactionBadge.propTypes = {
  transactionHash: PropTypes.string,
}

function getEtherscanHref(transactionHash) {
  const chainId = environment('CHAIN_ID')

  return `https://${
    chainId === 4 ? 'rinkeby.' : ''
  }etherscan.io/tx/${transactionHash}`
}

export default TransactionBadge
