import React from 'react'
import styled from 'styled-components/macro'
import TransactionBadge from './TransactionBadge'

import processing from './assets/loader.gif'

function Processing({ isFinal, transactionHash }) {
  return (
    <ProcessingIn>
      <div>
        <img src={processing} alt="" />
        <>
          <p className="black">
            Processing {isFinal ? 'last' : 'first'} transaction
          </p>
          <p>
            Please wait for transaction{' '}
            <TransactionBadge transactionHash={transactionHash} /> to be mined.
            Do not close this window until the process is finished.
          </p>
        </>
      </div>
    </ProcessingIn>
  )
}

const ProcessingIn = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  img {
    margin-bottom: 15px;
    height: 100px;
  }
  p {
    max-width: 410px;
    margin: 0;
  }
  p.black {
    color: #000;
  }
`

export default Processing
