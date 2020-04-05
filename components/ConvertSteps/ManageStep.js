import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Step from './step'

function ManageStep({
  title,
  number,
  handleTx,
  active,
  onSuccess,
  onError,
  onHashCreation,
}) {
  const [stepStatus, setStepStatus] = useState('waiting')
  const [isActive, setIsActive] = useState(false)

  const handleStepStatus = useCallback(async () => {
    if (active && !isActive) {
      setIsActive(true)

      try {
        // Awaiting confirmation
        const transaction = await handleTx()

        onHashCreation && onHashCreation(transaction.hash)

        // Mining transaction
        setStepStatus('working')
        await transaction.wait()

        // Success
        setStepStatus('success')

        onSuccess()
      } catch (err) {
        setStepStatus('error')
        onError()
        console.log(err)
      }
    }
  }, [handleTx, active, onSuccess, onError, onHashCreation, isActive])

  useEffect(() => {
    handleStepStatus()
  }, [handleStepStatus])

  return (
    <Step title={title} number={number} active={isActive} status={stepStatus} />
  )
}

Step.propTypes = {
  title: PropTypes.string,
  number: PropTypes.number,
}

export default ManageStep
