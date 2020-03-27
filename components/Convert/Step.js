import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import StatusIcon from './StatusIcon'

const STATUS_DESC = {
  waiting: 'Waiting for signature',
  working: 'Transaction being mined',
  success: 'Transaction confirmed',
  error: 'An error has occured at the time of transaction',
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
    default:
      return 'transparent'
  }
}

function Step({title, status, dormant, number}) {
  const desc = useMemo(() => STATUS_DESC[status], [status])
  const borderColor = useMemo(() => getBorderColor(status), [status])

  return (
    <div css={`
      display: flex;
      flex-direction: column;
      align-items: center;
    `}>
      <div css={`
        width: 110px;
        margin-bottom: 25px;
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

            border: 2px solid ${dormant ? 'transparent' : borderColor};
          `}>
            {
              status === 'waiting' &&
              <span css={`
                position: absolute;

                top: 50%;
                left: 50%;

                transform: translate(-50%, -50%);

                line-height: 1;
                color: #FFFFFF;
                font-size: 24px;
                font-weight: 600;

                z-index: 1;
              `}>
                {number}
              </span>
            }

            <StatusIcon status={status}/>
          </div>
        </div>

      </div>
      <h2 css={`
        text-align: center;
        margin-bottom: 7px;
        font-size: 20px;
        color: ${status === 'error' ? '#FF7C7C' : '#4A5165'};
        font-weight: 500;
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
  dormant: PropTypes.bool,
  status: PropTypes.oneOf([
    'waiting',
    'working',
    'success',
    'error',
  ]),
}



export default Step
