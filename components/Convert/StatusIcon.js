import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import successIcon from './assets/success.svg'
import waitingIcon from './assets/waiting.svg'
import workingIcon from './assets/working.svg'
import errorIcon from './assets/error.svg'
import errorPip from './assets/error-pip.svg'
import successPip from './assets/success-pip.svg'

const STATUS_ICONS = {
  waiting: waitingIcon,
  working: workingIcon,
  success: successIcon,
  error: errorIcon,
}

function renderPipIfErrorOrSuccess(status) {
  let pipImage

  if (status === 'error') {
    pipImage = errorPip
  } else if (status === 'success') {
    pipImage = successPip
  }

  return (
    <>
    {
      (status === 'error' || status === 'success') && 
        <img src={pipImage} alt="" css={`
        position: absolute;

        bottom: 0;
        right: 0;
      `}/>
    }
    </>
  )
}

function StatusIcon({status}) {
  const icon = useMemo(() => STATUS_ICONS[status], [status])

  return (
    <div css={`
      position: relative;
    `}>
      {renderPipIfErrorOrSuccess(status)}
      <img src={icon} alt=""/>
    </div>
  )
}

StatusIcon.propTypes = {
  title: PropTypes.string,
  status: PropTypes.oneOf([
    'waiting',
    'working',
    'success',
    'error',
  ]),
}



export default StatusIcon
