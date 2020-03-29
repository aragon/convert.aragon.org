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
  const [stepperStage, setStepperStage] = useState('working')

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
    async hash => {
      try {
        applyStepState('claimOrder', 'waiting')
        const transaction = await claimOrder(hash, toAnj)
        applyStepState('claimOrder', 'working', transaction.hash)
        await transaction.wait()
        applyStepState('claimOrder', 'success')
        setStepperStage('success')
      } catch (err) {
        applyStepState('claimOrder', 'error')
        setStepperStage('error')
        console.log(err)
      }
    },
    [claimOrder, applyStepState, toAnj]
  )

  const handleBuyOrderStep = useCallback(async () => {
    try {
      applyStepState('buyOrder', 'waiting')
      const transaction = await openOrder(amountSource, toAnj)
      applyStepState('buyOrder', 'working', transaction.hash)
      await transaction.wait()
      applyStepState('buyOrder', 'success')
      handleClaimOrderStep(transaction.hash)
    } catch (err) {
      applyStepState('buyOrder', 'error')
      setStepperStage('error')
      console.log(err)
    }
  }, [amountSource, openOrder, applyStepState, toAnj, handleClaimOrderStep])

  const handleApprovalStep = useCallback(async () => {
    try {
      await checkAllowance(amountSource)
      applyStepState('approval', 'success')
      handleBuyOrderStep()
    } catch (err) {
      applyStepState('approval', 'error')
      setStepperStage('error')
      console.log(err)
    }
  }, [amountSource, checkAllowance, applyStepState, handleBuyOrderStep])

  useEffect(() => {
    console.log(amountSource)
    if (toAnj) {
      handleApprovalStep()
    } else {
      handleBuyOrderStep()
    }
  }, [amountSource, handleApprovalStep, handleBuyOrderStep, toAnj])

  return (
    <StepperLayout
      fromAmount={formattedFromAmount}
      toAmount={formattedToAmount}
      stage={stepperStage}
      toAnj={toAnj}
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
