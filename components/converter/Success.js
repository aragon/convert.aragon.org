import React from 'react'
import styled from 'styled-components'
import TransactionBadge from './TransactionBadge'
import { useTokenDecimals } from 'lib/web3-contracts'
import { formatUnits } from 'lib/web3-utils'
import { useConverterStatus } from './converter-status'

import successImg from './assets/success.svg'

function SuccessSection({
  amountRequested,
  final,
  onDone,
  toAnj,
  transactionHash,
}) {
  const decimals = useTokenDecimals('ANJ')
  return (
    <Success>
      <div>
        <img src={successImg} alt="" />
        <p className="green">Transaction successful</p>
        <p>
          Transaction <TransactionBadge transactionHash={transactionHash} /> has
          been confirmed.{' '}
          {!final
            ? 'Do not close this window until the process is finished'
            : `You have successfully converted ${formatUnits(amountRequested, {
                digits: decimals,
              })}
          ${toAnj ? 'ANJ' : 'ANT'}`}
          .
        </p>
        {final && <Button onClick={onDone}>Start new conversion</Button>}
      </div>
    </Success>
  )
}

const Success = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  img {
    margin-bottom: 15px;
  }
  p {
    max-width: 410px;
    margin: 0;
  }
  p.green {
    color: #7fdfa6;
  }
`

const Button = styled.button`
  background: #ffffff;
  border: 1px solid #c7d1da;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  border-radius: 4px;
  width: 227px;
  height: 52px;
  text-align: center;
  font-size: 20px;
  line-height: 31px;
  text-align: center;
  color: #1c1c1c;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`

export default SuccessSection
