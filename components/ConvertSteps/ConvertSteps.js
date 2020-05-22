import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  STEPPER_IN_PROGRESS,
  STEPPER_SUCCESS,
  STEPPER_ERROR,
} from './stepper-statuses'
import Divider from './Divider'
import ManageStep from './ManageStep'
import StepperLayout from './StepperLayout'
import StepperTitle from './StepperTitle'

function ConvertSteps({ toAnj, fromAmount, toAmount, onReturnHome, steps }) {
  const [stepperStatus, setStepperStatus] = useState(STEPPER_IN_PROGRESS)
  const [stepperStage, setStepperStage] = useState(0)
  const [retryingStep, setRetryingStep] = useState(null)

  const handleRetry = useCallback(() => {
    setStepperStatus(STEPPER_IN_PROGRESS)
    setRetryingStep(stepperStage)
  }, [stepperStage])

  const handleError = useCallback(() => {
    setRetryingStep(null)
    setStepperStatus(STEPPER_ERROR)
  }, [])

  const handleSuccess = useCallback(
    optionalCb => {
      return () => {
        setRetryingStep(null)
        optionalCb && optionalCb()

        // Activate next step if not last
        if (stepperStage < steps.length - 1) {
          setStepperStage(stepperStage + 1)
        }

        // Show overall stepper success if final step succeeds
        if (stepperStage === steps.length - 1) {
          setStepperStatus(STEPPER_SUCCESS)
        }
      }
    },
    [stepperStage, steps]
  )

  const renderSteps = () => {
    return steps.map((step, index) => (
      <li
        css={`
          display: flex;
        `}
        key={index}
      >
        <ManageStep
          key={index}
          title={step[0]}
          number={index + 1}
          canRetry={retryingStep === index}
          handleTx={step[1].createTx}
          active={stepperStage === steps.indexOf(step)}
          onHashCreation={step[1].hashCreated}
          onSuccess={handleSuccess(step[1].success)}
          onError={handleError}
        />

        {/* Show a divider between every step except the last */}
        {index !== steps.length - 1 && <Divider />}
      </li>
    ))
  }

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
      <ul
        css={`
          padding: 0;
          display: flex;
        `}
      >
        {renderSteps()}
      </ul>
    </StepperLayout>
  )
}

ConvertSteps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.array),
  fromAmount: PropTypes.object,
  toAmount: PropTypes.object,
  toAnj: PropTypes.bool,
  onReturnHome: PropTypes.func,
}

export default ConvertSteps
