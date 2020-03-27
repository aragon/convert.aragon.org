import React from 'react'
import Step, {STEP_STATUS} from './Step'

function ConvertSteps() {
  return (
    <div css={`
      display: grid;
      grid-template-columns: repeat(3, minmax(0px, 1fr));
      grid-gap: 90px;
    `}>
      <Step title="Approve ANT" status={STEP_STATUS.WAITING}/>
      <Step title="Create buy order" status={STEP_STATUS.IN_PROGRESS}/>
      <Step title="Claim order" status={STEP_STATUS.ERROR}/>
    </div>
  )
}



export default ConvertSteps
