import React from 'react'
import PropTypes from 'prop-types'
import Step from './Step'

function ClaimOrderStep({ active, number }) {
  return (
    <>
      <Step
        title="Claim order"
        number={number}
        active={active}
        status="waiting"
      />
    </>
  )
}

Step.propTypes = {
  active: PropTypes.bool,
  number: PropTypes.string,
}

export default ClaimOrderStep
