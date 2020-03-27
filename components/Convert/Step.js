import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import successIcon from './assets/success.svg'
import waitingIcon from './assets/waiting.svg'
import workingIcon from './assets/working.svg'
import errorIcon from './assets/error.svg'

const statusInfo = {
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

function Step({title, status}) {
  const icon = useMemo(() => statusInfo[status].icon, [status])
  const desc = useMemo(() => statusInfo[status].desc, [status])

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

            border: 2px solid black;
          `}>
            <img src={icon} alt=""/>
          </div>
        </div>

      </div>
      <h2 css={`
        text-align: center;
        margin-bottom: 8px;
        font-size: 20px;
        color: #4A5165;
      `}>
        {title}
      </h2>

      <p css={`
        text-align: center;
        margin-bottom: 0;
        font-size: 14px;
        color: ${status === 'success' ? 'green' : '#637381'};
      `}>
        {desc}
      </p>
    </div>
  )
}


Step.propTypes = {
  title: PropTypes.string,
  status: PropTypes.oneOf([
    'waiting',
    'working',
    'success',
    'error',
  ]),
}



export default Step
