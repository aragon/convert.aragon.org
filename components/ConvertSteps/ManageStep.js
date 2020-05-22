import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Step from './Step'

function ManageStep({
  title,
  number,
  handleTx,
  active,
  onSuccess,
  onError,
  onHashCreation,
  canRetry,
}) {
  const [stepStatus, setStepStatus] = useState('waiting')
  const [hasBeenActivated, setHasBeenActivated] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [hash, setHash] = useState()

  const handleStepSigning = useCallback(async () => {
    setHasBeenActivated(true)

    try {
      setStepStatus('waiting')

      // Awaiting confirmation
      const transaction = await handleTx()

      onHashCreation && onHashCreation(transaction.hash)
      setHash(transaction.hash)

      // Mining transaction
      setStepStatus('working')
      await transaction.wait()

      // Success
      setStepStatus('success')

      onSuccess && onSuccess()
    } catch (err) {
      // If there's a problem mining the transaction we catch it
      // and visually feedback to the user
      setStepStatus('error')
      onError && onError()
      console.error(err)
    }

    setRetrying(false)
  }, [handleTx, onSuccess, onError, onHashCreation])

  useEffect(() => {
    if (active && !hasBeenActivated) {
      handleStepSigning()
    } else if (active && canRetry && !retrying) {
      setRetrying(true)
      handleStepSigning()
    }
  }, [handleStepSigning, hasBeenActivated, active, canRetry, retrying])

  return (
    <Step
      title={title}
      number={number}
      active={hasBeenActivated}
      status={stepStatus}
      transactionHash={hash}
    />
  )
}

Step.propTypes = {
  title: PropTypes.string,
  number: PropTypes.number,
  handleTx: PropTypes.func,
  active: PropTypes.bool,
  canRetry: PropTypes.bool,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onHashCreation: PropTypes.func,
}

export default ManageStep
