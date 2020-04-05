import React, { useCallback, useEffect, useState } from 'react'
import Divider from './Divider'
import PropTypes from 'prop-types'
import StepperLayout from './StepperLayout'
import ManageStep from './ManageStep'
import StepperTitle from './StepperTitle'

function ConvertSteps({ toAnj, fromAmount, toAmount, onReturnHome, steps }) {
  const [stepperStatus, setStepperStatus] = useState('working')
  const [stepperStage, setStepperStage] = useState(0)
  const [retryStep, setRetryStep] = useState(null)

  function handleRetry() {
    setStepperStatus('working')
    setRetryStep(stepperStage)
  }

  const clearRetry = () => setRetryStep(null)

  const handleError = () => {
    clearRetry()
    setStepperStatus('error')
  }

  const handleSuccess = useCallback(
    optionalCb => {
      return () => {
        clearRetry()
        optionalCb && optionalCb()

        // Activate next step if not last
        if (stepperStage <= steps.length - 1) {
          setStepperStage(stepperStage + 1)
        }

        // Show overall stepper success if final step succeeds
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
          retry={retryStep === index}
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
      onRepeatTransaction={handleRetry}
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
