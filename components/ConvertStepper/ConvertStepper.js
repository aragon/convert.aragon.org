import React from 'react'
import Divider from './Divider'
import StepperLayout from './StepperLayout'
import Step from './Step'

const STEP_WIDTH = 180

function ConvertStepper() {
  return (
    <StepperLayout
      antCount="323424"
      anjCount="54235"
      stage="success"
      toAnj={true}
    >
      <div
        css={`
          display: flex;
        `}
      >
        <Step
          title="Claim order"
          number="1"
          status="waiting"
          css={`
            width: ${STEP_WIDTH}px;
          `}
        />
        <Divider />
        <Step
          title="Approve ANT"
          number="2"
          dormant
          status="waiting"
          css={`
            width: ${STEP_WIDTH}px;
          `}
        />
        <Divider />
        <Step
          title="Create buy order"
          number="3"
          status="working"
          transactionHash="34dfsdsf35dsf"
          css={`
            width: ${STEP_WIDTH}px;
          `}
        />
        <Divider />
        <Step
          title="Claim order"
          number="4"
          status="success"
          transactionHash="34dfsdsf35dsf"
          css={`
            width: ${STEP_WIDTH}px;
          `}
        />
        <Divider />
        <Step
          title="Transaction failed"
          number="5"
          status="error"
          transactionHash="34dfsdsf35dsf"
          css={`
            width: ${STEP_WIDTH}px;
          `}
        />
      </div>
    </StepperLayout>
  )
}

export default ConvertStepper
