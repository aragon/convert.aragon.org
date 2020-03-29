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

function ConvertStepper({ toAnj, amountSource }) {
  const checkAllowance = useAllowance()
  const openOrder = useOpenOrder()
  const claimOrder = useClaimOrder()
  const [stepperState, setStepperState] = useState({
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

  const setStepStatus = useCallback((step, status, hash) => {
    setStepperState(prevState => {
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
        setStepStatus('claimOrder', 'waiting')
        const transaction = await claimOrder(hash, toAnj)
        setStepStatus('claimOrder', 'working', transaction.hash)
        await transaction.wait()
        setStepStatus('claimOrder', 'success')
      } catch (err) {
        setStepStatus('claimOrder', 'error')
        console.log(err)
      }
    },
    [claimOrder, setStepStatus, toAnj]
  )

  const handleBuyOrderStep = useCallback(async () => {
    try {
      setStepStatus('buyOrder', 'waiting')
      const transaction = await openOrder(amountSource, toAnj)
      setStepStatus('buyOrder', 'working', transaction.hash)
      await transaction.wait()
      setStepStatus('buyOrder', 'success')
      handleClaimOrderStep(transaction.hash)
    } catch (err) {
      setStepStatus('buyOrder', 'error')
      console.log(err)
    }
  }, [amountSource, openOrder, setStepStatus, toAnj, handleClaimOrderStep])

  const handleApprovalStep = useCallback(async () => {
    try {
      await checkAllowance(amountSource)
      setStepStatus('approval', 'success')
      handleBuyOrderStep()
    } catch (err) {
      setStepStatus('approval', 'error')
      console.log(err)
    }
  }, [amountSource, checkAllowance, setStepStatus, handleBuyOrderStep])

  useEffect(() => {
    if (toAnj) {
      handleApprovalStep()
    } else {
      handleBuyOrderStep()
    }
  }, [amountSource, handleApprovalStep, handleBuyOrderStep, toAnj])

  return (
    <StepperLayout
      antCount="323424"
      anjCount="54235"
      stage="working"
      toAnj={true}
    >
      {toAnj && (
        <>
          <Step
            title="Approve ANT"
            number="1"
            active={stepperState.approval.active}
            status={stepperState.approval.status}
          />
          <Divider />
        </>
      )}

      <Step
        title="Create buy order"
        number={toAnj ? '2' : '1'}
        active={stepperState.buyOrder.active}
        status={stepperState.buyOrder.status}
        transactionHash={stepperState.buyOrder.hash}
      />
      <Divider />
      <Step
        title="Claim order"
        number={toAnj ? '3' : '2'}
        active={stepperState.claimOrder.active}
        status={stepperState.claimOrder.status}
        transactionHash={stepperState.claimOrder.hash}
      />
    </StepperLayout>
  )
}

ConvertStepper.propTypes = {
  toAnj: PropTypes.bool,
}

export default ConvertStepper
