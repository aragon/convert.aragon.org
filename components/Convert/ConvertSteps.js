import React from 'react'
import Step from './Step'

function ConvertSteps() {
  return (
    <div css={`
      display: grid;
      grid-template-columns: repeat(2, minmax(0px, 1fr));
      grid-gap: 30px;
    `}>
      <Step title="Claim order" status="waiting" dormant/>
      <Step title="Approve ANT" status="waiting"/>
      <Step title="Create buy order" status="working"/>
      <Step title="Claim order" status="success"/>
      <Step title="Transaction failed" status="error"/>
    </div>
  )
}



export default ConvertSteps
