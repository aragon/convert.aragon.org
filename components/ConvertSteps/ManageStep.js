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
  retry,
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
      setStepStatus('error')
      onError && onError()
      console.log(err)
    }

    setRetrying(false)
  }, [handleTx, onSuccess, onError, onHashCreation])

  useEffect(() => {
    if (active && !hasBeenActivated) {
      handleStepSigning()
    } else if (active && retry && !retrying) {
      setRetrying(true)
      handleStepSigning()
    }
  }, [handleStepSigning, hasBeenActivated, active, retry, retrying])

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
}

export default ManageStep
