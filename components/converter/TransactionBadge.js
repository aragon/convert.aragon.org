import React from 'components/converter/node_modules/react'
import PropTypes from 'components/converter/node_modules/prop-types'
import Anchor from '../Anchor/Anchor'
import { shortenAddress } from 'components/converter/node_modules/lib/web3-utils'
import { getEtherscanHref } from 'components/converter/node_modules/lib/utils'

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
          color: #20232c;
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
