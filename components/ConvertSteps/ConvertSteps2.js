import React, { useCallback, useEffect, useState } from 'react'
import Divider from './Divider'
import PropTypes from 'prop-types'
import StepperLayout from './StepperLayout'
import ManageStep from './ManageStep'
import StepperTitle from './StepperTitle'

function ConvertSteps({ toAnj, fromAmount, toAmount, onReturnHome, steps }) {
  const [stepperStatus, setStepperStatus] = useState('working')
  const [stepperStage, setStepperStage] = useState(0)

  function handleRepeatTransaction() {
    console.log('handle repeat tx')
  }

  function handleError() {
    console.log('handle error')
    setStepperStatus('error')
  }

  const handleSuccess = useCallback(
    optionalCb => {
      return () => {
        optionalCb && optionalCb()

        // Activate next step if not last
        if (stepperStage <= steps.length - 1) {
          setStepperStage(stepperStage + 1)
        }

        // Show overall stepper success if last step succeeds
        if (stepperStage === steps.length - 1) {
          setStepperStatus('success')
        }
      }
    },
    [stepperStage, steps]
  )

  const renderSteps = () => {
    return steps.map((step, index) => (
      <>
        <ManageStep
          title={step[0]}
          number={index + 1}
          handleTx={step[1].createTx}
          active={stepperStage === steps.indexOf(step)}
          onHashCreation={step[1].hashCreated}
          onSuccess={handleSuccess(step[1].success)}
          onError={handleError}
        />

        {index !== steps.length - 1 && <Divider />}
      </>
    ))
  }

  useEffect(() => {})

  return (
    <StepperLayout
      status={stepperStatus}
      onRepeatTransaction={handleRepeatTransaction}
      onReturnHome={onReturnHome}
      title={
        <StepperTitle
          fromAmount={fromAmount}
          toAmount={toAmount}
          toAnj={toAnj}
          status={stepperStatus}
        />
      }
    >
      {renderSteps()}
    </StepperLayout>
  )
}

ConvertSteps.propTypes = {
  toAnj: PropTypes.bool,
  handleReturnHome: PropTypes.func,
}

export default ConvertSteps
