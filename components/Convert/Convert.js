import React from 'react'
import ConvertSteps from './ConvertSteps'
import StepperLayout from './StepperLayout'

function Convert() {
  return (
    <StepperLayout
      anjCount="324234"
      antCount="323424"
      stage="working"
      toAnj={true}
    >
      <ConvertSteps />
    </StepperLayout>
  )
}



export default Convert
