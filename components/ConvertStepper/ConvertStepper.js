import React, { useCallback, useEffect, useState } from 'react'
import Divider from './Divider'
import PropTypes from 'prop-types'
import StepperLayout from './StepperLayout'
import {
  useAllowance,
  useOpenOrder,
  useClaimOrder,
} from 'lib/web3-contracts-new'
import Step from './Step'
import { formatUnits } from 'lib/web3-utils'
import { useTokenDecimals } from 'lib/web3-contracts'

function ConvertStepper({ toAnj, amountSource, amountRecipient }) {
  const checkAllowance = useAllowance()
  const openOrder = useOpenOrder()
  const claimOrder = useClaimOrder()
  const antDecimals = useTokenDecimals('ANT')
  const anjDecimals = useTokenDecimals('ANJ')

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

  const formattedFromAmount = formatUnits(amountSource, {
    digits: toAnj ? antDecimals : anjDecimals,
    truncateToDecimalPlace: 8,
    commas: true,
  })

  const formattedToAmount = formatUnits(amountRecipient, {
    digits: toAnj ? anjDecimals : antDecimals,
    truncateToDecimalPlace: 8,
    commas: true,
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
      await checkAllowance(amountSource)

      // Success
      applyStepState(stepType, 'success')
      handleBuyOrderStep()
    } catch (err) {
      applyStepState(stepType, 'error')
      setStepperStage('error')
      console.log(err)
    }
  }, [amountSource, checkAllowance, applyStepState, handleBuyOrderStep])

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
      fromAmount={formattedFromAmount}
      toAmount={formattedToAmount}
      stage={stepperStage}
      toAnj={toAnj}
      onRepeatTransaction={handleRepeatTransaction}
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

ConvertStepper.propTypes = {
  toAnj: PropTypes.bool,
}

export default ConvertStepper
