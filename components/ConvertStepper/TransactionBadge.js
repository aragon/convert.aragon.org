import React from 'react'
import PropTypes from 'prop-types'
import Anchor from '../Anchor/Anchor'
import environment from 'lib/environment'
import { shortenAddress } from 'lib/web3-utils'

function TransactionBadge({ transactionHash, className }) {
  return (
    <div
      className={className}
      css={`
        display: inline;
        background: #ebfafd;
        color: black;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 16px;
        line-height: 1;
      `}
    >
      <Anchor
        href={getEtherscanHref(transactionHash)}
        css={`
          color: #20232C;
        `}
      >
        {shortenAddress(transactionHash)}
      </Anchor>
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