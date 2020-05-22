import React from 'react'
import PropTypes from 'prop-types'
import successIcon from './assets/success.svg'
import waitingIcon from './assets/waiting.svg'
import workingIcon from './assets/working.svg'
import errorIcon from './assets/error.svg'
import errorPip from './assets/error-pip.svg'
import successPip from './assets/success-pip.svg'
import {
  STEP_WAITING,
  STEP_WORKING,
  STEP_SUCCESS,
  STEP_ERROR,
} from './stepper-statuses'

const STATUS_ICONS = {
  [STEP_WAITING]: waitingIcon,
  [STEP_WORKING]: workingIcon,
  [STEP_SUCCESS]: successIcon,
  [STEP_ERROR]: errorIcon,
}

const PIP_ICONS = {
  error: errorPip,
  success: successPip,
}

function renderPipIfErrorOrSuccess(status) {
  let pipImage = PIP_ICONS[status]

  return (
    <>
      {pipImage && (
        <img
          src={pipImage}
          alt=""
          css={`
            position: absolute;

            bottom: 0;
            right: 0;
          `}
        />
      )}
    </>
  )
}

function StatusIcon({ status }) {
  const icon = STATUS_ICONS[status]

  return (
    <div
      css={`
        position: relative;
      `}
    >
      {renderPipIfErrorOrSuccess(status)}
      <img src={icon} alt="" />
    </div>
  )
}

StatusIcon.propTypes = {
  title: PropTypes.string,
  status: PropTypes.oneOf([
    STEP_WAITING,
    STEP_WORKING,
    STEP_SUCCESS,
    STEP_ERROR,
  ]),
}

export default StatusIcon
