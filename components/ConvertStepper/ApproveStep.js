import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Step from './Step'
import { useAllowance } from 'lib/web3-contracts-new'

function ApproveStep({ active, number, amountSource }) {
  return (
    <>
      <Step
        title="Approve ANT"
        number={number}
        active={active}
        status="error"
      />
    </>
  )
}

Step.propTypes = {
  active: PropTypes.bool,
  number: PropTypes.string,
}

export default ApproveStep
