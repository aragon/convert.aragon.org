import React from 'react'
import Step from './Step'
import Divider from './Divider'

const STEP_WIDTH = 180

function ConvertSteps() {
  return (
    <div css={`
      display: flex;
    `}>
      <Step
        title="Claim order"
        number="1"
        status="waiting"
        dormant
        css={`width: ${STEP_WIDTH}px;`}/>
      <Divider/>
      <Step
        title="Approve ANT"
        number="2"
        status="waiting"
        css={`width: ${STEP_WIDTH}px;`}
      />
      <Divider/>
      <Step
        title="Create buy order"
        number="3"
        status="working"
        css={`width: ${STEP_WIDTH}px;`}/>
      <Divider/>
      <Step
        title="Claim order"
        number="4"
        status="success"
        transactionHash="34dfsdsf35dsf"
        css={`width: ${STEP_WIDTH}px;`}
      />
      <Divider/>
      <Step
        title="Transaction failed"
        number="5"
        status="error"
        css={`width: ${STEP_WIDTH}px;`}
      />
    </div>
  )
}



export default ConvertSteps
