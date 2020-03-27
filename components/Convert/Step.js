import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import successIcon from './assets/success.svg'
import waitingIcon from './assets/waiting.svg'
import workingIcon from './assets/working.svg'
import errorIcon from './assets/error.svg'
import errorPip from './assets/error-pip.svg'
import successPip from './assets/success-pip.svg'

const statusInfo = {
  dormant: {
    desc: 'Waiting for signature',
    icon: waitingIcon,
  },
  waiting: {
    desc: 'Waiting for signature',
    icon: waitingIcon,
  },
  working: {
    desc: 'Transaction being mined',
    icon: workingIcon,
  },
  success: {
    desc: 'Transaction confirmed',
    icon: successIcon,
  },
  error: {
    desc: 'An error has occured at the time of transaction',
    icon: errorIcon,
  }
}

function getBorderColor(status) {
  switch (status) {
    case 'success':
      return '#2CC68F'
    case 'error':
      return '#FF7163'
    case 'working':
      return '#FFAA75'
    case 'waiting':
      return '#FFAA75'
    case 'dormant':
      return 'transparent'
    default:
      return 'transparent'
  }
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

function Step({title, status}) {
  const icon = useMemo(() => statusInfo[status].icon, [status])
  const desc = useMemo(() => statusInfo[status].desc, [status])
  const borderColor = useMemo(() => getBorderColor(status), [status])

  return (
    <div css={`
      display: flex;
      flex-direction: column;
      align-items: center;
    `}>
      <div css={`
        width: 110px;
        margin-bottom: 30px;
      `}>
        <div css={`
          position: relative;
          width: 100%;
          padding-top: 100%;
        `}>

          <div css={`
            display: flex;

            align-items: center;
            justify-content: center;
            position: absolute;

            top: 0;
            left: 0;
            bottom: 0;
            right: 0;

            border-radius: 100%;

            border: 2px solid ${borderColor};
          `}>
            <div css={`
              position: relative;
            `}>
              {renderPipIfErrorOrSuccess(status)}
              <img src={icon} alt=""/>
            </div>
          </div>
        </div>

      </div>
      <h2 css={`
        text-align: center;
        margin-bottom: 8px;
        font-size: 20px;
        color: ${status === 'error' ? '#FF7C7C' : '#4A5165'};
      `}>
        {title}
      </h2>

      <p css={`
        text-align: center;
        margin-bottom: 0;
        font-size: 14px;
        color: ${status === 'success' ? '#2CC68F' : '#637381'};
      `}>
        {desc}
      </p>
    </div>
  )
}


Step.propTypes = {
  title: PropTypes.string,
  status: PropTypes.oneOf([
    'dormant',
    'waiting',
    'working',
    'success',
    'error',
  ]),
}



export default Step
