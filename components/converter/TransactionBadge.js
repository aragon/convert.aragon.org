import React from 'react'
import PropTypes from 'prop-types'
import Anchor from '../Anchor/Anchor'
import { shortenAddress } from 'lib/web3-utils'
import { getEtherscanHref } from 'lib/utils'

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
      <Anchor
        href={getEtherscanHref(transactionHash)}
        css={`
          color: black;
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

export default TransactionBadge
