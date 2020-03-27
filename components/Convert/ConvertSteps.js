import React from 'react'
import Step from './Step'

function ConvertSteps() {
  return (
    <div css={`
      display: grid;
      grid-template-columns: repeat(2, minmax(0px, 1fr));
      grid-gap: 30px;
    `}>
      <Step title="Claim order" number="1" status="waiting" dormant/>
      <Step title="Approve ANT" number="2" status="waiting"/>
      <Step title="Create buy order" number="3"  status="working"/>
      <Step title="Claim order" number="4" status="success"/>
      <Step title="Transaction failed" number="5" status="error"/>
    </div>
  )
}



export default ConvertSteps
