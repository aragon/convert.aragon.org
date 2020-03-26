import React from 'react'
import styled from 'styled-components/macro'
import processing from './assets/loader.gif'

function Pending({ isFinal }) {
  return (
    <PendingIn>
      <div>
        <img src={processing} alt="" />
        <>
          <p className="black">Sign {isFinal ? 'last' : 'first'} transaction</p>
          <p>
            This process might take up to a few minutes. Do not close this
            window until the process is finished.
          </p>
        </>
      </div>
    </PendingIn>
  )
}

const PendingIn = styled.div`
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

export default Pending
