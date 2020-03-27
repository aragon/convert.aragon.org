import React from 'react'
import Step from './Step'
import Divider from './Divider'

function ConvertSteps() {
  return (
    <div css={`
      display: flex;
    `}>
      <Step title="Claim order" number="1" status="waiting" dormant/>
      <Divider/>
      <Step title="Approve ANT" number="2" status="waiting"/>
      <Divider/>
      <Step title="Create buy order" number="3"  status="working"/>
      <Divider/>
      <Step title="Claim order" number="4" status="success"/>
      <Divider/>
      <Step title="Transaction failed" number="5" status="error"/>
    </div>
  )
}



export default ConvertSteps
