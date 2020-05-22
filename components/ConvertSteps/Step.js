import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { keyframes, css } from 'styled-components'
import {
  STEP_WAITING,
  STEP_WORKING,
  STEP_SUCCESS,
  STEP_ERROR,
} from './stepper-statuses'
import StatusIcon from './StatusIcon'

import TransactionBadge from './TransactionBadge'
import { ABSOLUTE_FILL } from 'lib/css-utils'

const STATUS_DESC = {
  [STEP_WAITING]: 'Waiting for signature',
  [STEP_WORKING]: 'Transaction being mined',
  [STEP_SUCCESS]: 'Transaction confirmed',
  [STEP_ERROR]: 'An error occurred with the transaction',
}

const spinAnimation = css`
  mask-image: linear-gradient(35deg, transparent 15%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 1.25s linear infinite;
`

const pulseAnimation = css`
  animation: ${keyframes`
    from {
      opacity: 1;
    }

    to {
      opacity: 0.25;
    }
  `} 0.75s linear alternate infinite;
`

function getBorderColor(status) {
  switch (status) {
    case STEP_WAITING:
      return '#FFAA75'
    case STEP_WORKING:
      return '#FFAA75'
    case STEP_SUCCESS:
      return '#2CC68F'
    case STEP_ERROR:
      return '#FF7163'

    default:
      return 'transparent'
  }
}

function Step({ title, status, active, number, className, transactionHash }) {
  const desc = useMemo(() => STATUS_DESC[status], [status])
  const borderColor = useMemo(() => getBorderColor(status), [status])

  return (
    <div
      className={className}
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 180px;
      `}
    >
      <div
        css={`
          width: 110px;
          margin-bottom: 25px;
        `}
      >
        <div
          css={`
            position: relative;
            width: 100%;
            padding-top: 100%;
          `}
        >
          <div
            css={`
              ${ABSOLUTE_FILL}

              display: flex;

              align-items: center;
              justify-content: center;
            `}
          >
            {status === STEP_WAITING && (
              <span
                css={`
                  position: absolute;

                  top: 50%;
                  left: 50%;

                  transform: translate(-50%, -50%);

                  line-height: 1;
                  color: #ffffff;
                  font-size: 24px;
                  font-weight: 600;

                  z-index: 1;
                `}
              >
                {number}
              </span>
            )}

            <StatusIcon status={status} />

            <div
              css={`
                ${ABSOLUTE_FILL}

                border-radius: 100%;

                border: 2px solid ${active ? borderColor : 'transparent'};

                ${status === STEP_WAITING && pulseAnimation}
                ${status === STEP_WORKING && spinAnimation}
              `}
            ></div>
          </div>
        </div>
      </div>
      <h2
        css={`
          text-align: center;
          margin-bottom: 7px;
          font-size: 20px;
          color: ${status === STEP_ERROR ? '#FF7C7C' : '#4A5165'};
          font-weight: 500;
        `}
      >
        {status === STEP_ERROR ? 'Transaction failed' : title}
      </h2>

      <p
        css={`
          text-align: center;
          margin-bottom: 0;
          font-size: 14px;
          color: ${status === STEP_SUCCESS ? '#2CC68F' : '#637381'};
        `}
      >
        {desc}
      </p>

      <div
        css={`
          position: relative;

          /* Avoid visual jump when showing tx by pre-filling space */
          padding-bottom: 40px;
          margin-bottom: -40px;
          width: 100%;
        `}
      >
        <div
          css={`
            ${ABSOLUTE_FILL}

            display: flex;
            justify-content: center;
          `}
        >
          {transactionHash && (
            <TransactionBadge
              transactionHash={transactionHash}
              css={`
                margin-top: 12px;
              `}
            />
          )}
        </div>
      </div>
    </div>
  )
}

Step.propTypes = {
  title: PropTypes.string,
  transactionHash: PropTypes.string,
  active: PropTypes.bool,
  status: PropTypes.oneOf([
    STEP_WAITING,
    STEP_WORKING,
    STEP_SUCCESS,
    STEP_ERROR,
  ]),
}

export default Step
