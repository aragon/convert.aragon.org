import React, { useCallback, useEffect, useState } from 'react'
import Divider from './Divider'
import PropTypes from 'prop-types'
import StepperLayout from './StepperLayout'
import {
  useAllowance,
  useOpenOrder,
  useClaimOrder,
  useApprove,
} from 'lib/web3-contracts'
import Step from './Step'
import StepperTitle from './StepperTitle'
import { bigNum } from 'lib/utils'

function ConvertSteps({ toAnj, amountSource, amountRecipient, onReturnHome }) {
  const getAllowance = useAllowance()
  const changeAllowance = useApprove()
  const openOrder = useOpenOrder()
  const claimOrder = useClaimOrder()

  const [stepperStage, setStepperStage] = useState('working')
  const [currentStep, setCurrentStep] = useState(
    toAnj ? 'approval' : 'buyOrder'
  )
  const [stepState, setStepState] = useState({
    approval: {
      status: 'waiting',
      active: true,
    },
    buyOrder: {
      status: 'waiting',
      active: toAnj ? false : true,
      hash: '',
    },
    claimOrder: {
      status: 'waiting',
      active: false,
      hash: '',
    },
  })

  const applyStepState = useCallback((step, status, hash) => {
    setStepState(prevState => {
      return {
        ...prevState,
        [step]: {
          status: status,
          active: true,
          hash: hash ? hash : prevState[step].hash,
        },
      }
    })
  }, [])

  const handleClaimOrderStep = useCallback(
    async buyOrderHash => {
      const stepType = 'claimOrder'

      setCurrentStep(stepType)

      try {
        // Awaiting confirmation
        applyStepState(stepType, 'waiting')
        const transaction = await claimOrder(buyOrderHash, toAnj)

        // Mining transaction
        applyStepState(stepType, 'working', transaction.hash)
        await transaction.wait()

        // Success
        applyStepState(stepType, 'success')
        setStepperStage('success')
      } catch (err) {
        applyStepState(stepType, 'error')
        setStepperStage('error')
        console.log(err)
      }
    },
    [claimOrder, applyStepState, toAnj]
  )

  const handleBuyOrderStep = useCallback(async () => {
    const stepType = 'buyOrder'

    setCurrentStep(stepType)

    try {
      // Awaiting confirmation
      applyStepState(stepType, 'waiting')
      const transaction = await openOrder(amountSource, toAnj)

      // Mining transaction
      applyStepState(stepType, 'working', transaction.hash)
      await transaction.wait()

      // Success
      applyStepState(stepType, 'success')
      handleClaimOrderStep(transaction.hash)
    } catch (err) {
      applyStepState(stepType, 'error')
      setStepperStage('error')
      console.log(err)
    }
  }, [amountSource, openOrder, applyStepState, toAnj, handleClaimOrderStep])

  const handleApprovalStep = useCallback(async () => {
    const stepType = 'approval'

    setCurrentStep(stepType)

    try {
      // Awaiting approval
      applyStepState(stepType, 'waiting')

      const allowance = await getAllowance()

      applyStepState(stepType, 'working')

      if (allowance.lt(bigNum(amountSource))) {
        console.log('needs allowance reset')
        const resetAllownaceTx = await changeAllowance(0)

        await resetAllownaceTx.wait()
      }

      const changeAllowanceToProvidedTx = await changeAllowance(amountSource)

      await changeAllowanceToProvidedTx.wait()

      // Success
      applyStepState(stepType, 'success')
      handleBuyOrderStep()
    } catch (err) {
      applyStepState(stepType, 'error')
      setStepperStage('error')
      console.log(err)
    }
  }, [
    amountSource,
    applyStepState,
    handleBuyOrderStep,
    changeAllowance,
    getAllowance,
  ])

  function handleRepeatTransaction() {
    if (currentStep === 'approval') {
      handleApprovalStep()
    } else if (currentStep === 'buyOrder') {
      handleBuyOrderStep()
    } else if (currentStep === 'claimOrder') {
      handleClaimOrderStep(stepState.buyOrder.hash)
    }
  }

  useEffect(() => {
    if (amountSource) {
      toAnj ? handleApprovalStep() : handleBuyOrderStep()
    }
  }, [amountSource, handleApprovalStep, handleBuyOrderStep, toAnj])

  return (
    <StepperLayout
      stage={stepperStage}
      onRepeatTransaction={handleRepeatTransaction}
      onReturnHome={onReturnHome}
      title={
        <StepperTitle
          fromAmount={amountSource}
          toAmount={amountRecipient}
          toAnj={toAnj}
          stage={stepperStage}
        />
      }
    >
      {toAnj && (
        <>
          <Step
            title="Approve ANT"
            number="1"
            active={stepState.approval.active}
            status={stepState.approval.status}
          />
          <Divider />
        </>
      )}

      <Step
        title="Create buy order"
        number={toAnj ? '2' : '1'}
        active={stepState.buyOrder.active}
        status={stepState.buyOrder.status}
        transactionHash={stepState.buyOrder.hash}
      />
      <Divider />
      <Step
        title="Claim order"
        number={toAnj ? '3' : '2'}
        active={stepState.claimOrder.active}
        status={stepState.claimOrder.status}
        transactionHash={stepState.claimOrder.hash}
      />
    </StepperLayout>
  )
}

ConvertSteps.propTypes = {
  toAnj: PropTypes.bool,
  handleReturnHome: PropTypes.func,
}

export default ConvertSteps
