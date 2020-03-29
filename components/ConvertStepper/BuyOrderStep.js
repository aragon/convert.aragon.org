import React from 'react'
import PropTypes from 'prop-types'
import Step from './Step'

function BuyOrderStep({ active, number }) {
  return (
    <>
      <Step
        title="Create buy order"
        number={number}
        active={active}
        status="working"
      />
    </>
  )
}

Step.propTypes = {
  active: PropTypes.bool,
  number: PropTypes.string,
}

export default BuyOrderStep
