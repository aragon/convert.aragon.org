import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useReducer,
} from 'react'
import useMeasure from 'react-use-measure'
import { ResizeObserver as Polyfill } from '@juggle/resize-observer'
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

function buildInitialStepState(steps) {
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
  const [stepperDisplayMode, setStepperDisplayMode] = useState('large')
  const [innerBoundsWidth, setInnerBoundsWidth] = useState()
  const [outerBoundsRef, outerBounds] = useMeasure({ scroll: true, Polyfill })
  const innerBoundsRef = useRef(null)

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

  const [stepsState, updateStep] = useReducer(
    reduceSteps,
    buildInitialStepState(steps)
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

        // Activate next step if not last
        if (stepperStage < steps.length - 1) {
          setStepperStage(stepperStage + 1)
        }

        // Show overall stepper success if final step succeeds
        if (stepperStage === steps.length - 1) {
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

  const handleRetry = useCallback(() => {
    setStepperStatus(STEPPER_IN_PROGRESS)

    attemptStepSigning(stepperStage)
  }, [attemptStepSigning, stepperStage])

  useEffect(() => {
    attemptStepSigning(stepperStage)
  }, [stepperStage, attemptStepSigning])

  useEffect(() => {
    if (!innerBoundsWidth) {
      setInnerBoundsWidth(innerBoundsRef.current.offsetWidth)
    }

    if (
      outerBounds.width - 200 < innerBoundsWidth &&
      stepperDisplayMode === 'large'
    ) {
      setStepperDisplayMode('small')
    }

    if (
      outerBounds.width - 200 > innerBoundsWidth &&
      stepperDisplayMode === 'small'
    ) {
      setStepperDisplayMode('large')
    }
  }, [outerBounds.width, innerBoundsWidth, stepperDisplayMode])

  const renderSteps = mode => {
    return steps.map((step, index) => {
      const stepCurrentlyActive = stepperStage === steps.indexOf(step)

      const stepToRender = (
        <Step
          title={step[0]}
          number={index + 1}
          active={stepsState[index].active}
          status={stepsState[index].status}
          transactionHash={stepsState[index].hash}
        />
      )

      return (
        <li
          key={index}
          css={`
            display: flex;
          `}
        >
          {mode === 'small' && stepCurrentlyActive && <>{stepToRender}</>}
          {mode === 'large' && (
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
          {renderSteps(stepperDisplayMode)}
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
