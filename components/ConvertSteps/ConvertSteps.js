import React, { useCallback, useState, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import {
  STEPPER_IN_PROGRESS,
  STEPPER_SUCCESS,
  STEPPER_ERROR,
  STEP_WAITING,
  STEP_WORKING,
  STEP_SUCCESS,
  STEP_ERROR,
} from './stepper-statuses'
import Divider from './Divider'
import Step from './Step'
import StepperLayout from './StepperLayout'
import StepperTitle from './StepperTitle'
import useStepLayout from './useStepLayout'

function initialStepState(steps) {
  return steps.map(() => {
    return {
      status: STEP_WAITING,
      hash: null,
      active: false,
    }
  })
}

function ConvertSteps({ toAnj, fromAmount, toAmount, onReturnHome, steps }) {
  const [stepperStatus, setStepperStatus] = useState(STEPPER_IN_PROGRESS)
  const [stepperStage, setStepperStage] = useState(0)
  const [outerBoundsRef, innerBoundsRef, layoutName] = useStepLayout(100)

  function reduceSteps(steps, [action, stepIndex, value]) {
    if (action === 'setActive') {
      steps[stepIndex].active = true
      return [...steps]
    }
    if (action === 'setHash') {
      steps[stepIndex].hash = value
      return [...steps]
    }
    if (action === 'setStatus') {
      steps[stepIndex].status = value
      return [...steps]
    }
    return steps
  }

  const [stepState, updateStep] = useReducer(
    reduceSteps,
    initialStepState(steps)
  )

  const attemptStepSigning = useCallback(
    async stepIndex => {
      const onHashCreated = steps[stepIndex][1].hashCreated
      const createTx = steps[stepIndex][1].createTx

      try {
        updateStep(['setActive', stepIndex])
        updateStep(['setStatus', stepIndex, STEP_WAITING])

        // Awaiting confirmation
        const transaction = await createTx()

        onHashCreated && onHashCreated(transaction.hash)
        updateStep(['setHash', stepIndex, transaction.hash])

        // Mining transaction
        updateStep(['setStatus', stepIndex, STEP_WORKING])
        await transaction.wait()

        // Success
        updateStep(['setStatus', stepIndex, STEP_SUCCESS])

        // Activate next step or show as completed
        if (stepperStage < steps.length - 1) {
          setStepperStage(stepperStage + 1)
        } else {
          setStepperStatus(STEPPER_SUCCESS)
        }
      } catch (err) {
        // If there's a problem mining the transaction we catch it
        // and visually feedback to the user
        updateStep(['setStatus', stepIndex, STEP_ERROR])
        setStepperStatus(STEPPER_ERROR)
        console.error(err)
      }
    },
    [steps, stepperStage]
  )

  const handleRetrySigning = useCallback(() => {
    setStepperStatus(STEPPER_IN_PROGRESS)
    attemptStepSigning(stepperStage)
  }, [attemptStepSigning, stepperStage])

  useEffect(() => {
    attemptStepSigning(stepperStage)
  }, [stepperStage, attemptStepSigning])

  const renderSteps = () => {
    return steps.map((step, index) => {
      const stepCurrentlyActive = stepperStage === steps.indexOf(step)

      const stepToRender = (
        <Step
          title={step[0]}
          number={index + 1}
          active={stepState[index].active}
          status={stepState[index].status}
          transactionHash={stepState[index].hash}
        />
      )

      return (
        <li
          key={index}
          css={`
            display: flex;
          `}
        >
          {layoutName === 'small' && stepCurrentlyActive && <>{stepToRender}</>}
          {layoutName === 'large' && (
            <>
              {stepToRender}

              {/* Show a divider between every step except the last */}
              {index !== steps.length - 1 && <Divider />}
            </>
          )}
        </li>
      )
    })
  }

  return (
    <StepperLayout
      status={stepperStatus}
      onRepeatTransaction={handleRetrySigning}
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
      <div
        ref={outerBoundsRef}
        css={`
          display: flex;
          justify-content: center;
          width: 100%;
        `}
      >
        <ul
          ref={innerBoundsRef}
          css={`
            padding: 0;
            display: flex;
          `}
        >
          {renderSteps()}
        </ul>
      </div>
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
