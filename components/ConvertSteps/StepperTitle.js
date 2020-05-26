import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'styled-components'
import {
  STEPPER_IN_PROGRESS,
  STEPPER_SUCCESS,
  STEPPER_ERROR,
} from './stepper-statuses'
import { formatUnits } from 'lib/web3-utils'
import { useTokenDecimals } from 'lib/web3-contracts'

const smallCaps = css`
  font-size: 32px;
`

function StepperTitle({ fromAmount, toAmount, status, toAnj }) {
  const antDecimals = useTokenDecimals('ANT')
  const anjDecimals = useTokenDecimals('ANJ')

  const formattedFromAmount = formatUnits(fromAmount, {
    digits: toAnj ? antDecimals : anjDecimals,
    truncateToDecimalPlace: 8,
    commas: true,
  })

  const formattedToAmount = formatUnits(toAmount, {
    digits: toAnj ? anjDecimals : antDecimals,
    truncateToDecimalPlace: 8,
    commas: true,
  })

  if (status === STEPPER_IN_PROGRESS || status === STEPPER_ERROR) {
    return (
      <>
        Convert {formattedFromAmount}{' '}
        <span css={smallCaps}>{toAnj ? 'ANT' : 'ANJ'}</span> to{' '}
        <span css={smallCaps}>{toAnj ? 'ANJ' : 'ANT'}</span>
      </>
    )
  } else if (status === STEPPER_SUCCESS) {
    return (
      <>
        You successfully converted <br />
        {formattedFromAmount}{' '}
        <span css={smallCaps}>{toAnj ? 'ANT' : 'ANJ'}</span> to{' '}
        {formattedToAmount} <span css={smallCaps}>{toAnj ? 'ANJ' : 'ANT'}</span>
      </>
    )
  }
}

StepperTitle.propTypes = {
  fromAmount: PropTypes.object,
  toAmount: PropTypes.object,
  toAnj: PropTypes.bool,
  status: PropTypes.oneOf([
    STEPPER_IN_PROGRESS,
    STEPPER_SUCCESS,
    STEPPER_ERROR,
  ]),
}

export default StepperTitle
