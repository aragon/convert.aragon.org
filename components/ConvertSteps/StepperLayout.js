import React from 'react'
import Button from './Button'
import PropTypes from 'prop-types'
import repeat from './assets/repeat.svg'

function StepperLayout({
  children,
  status,
  onRepeatTransaction,
  onReturnHome,
  title,
}) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        background-color: #f9fafc;
      `}
    >
      <div
        css={`
          display: flex;
          flex: 1;
          align-items: flex-end;
        `}
      >
        <h1
          css={`
            margin-bottom: 80px;
            color: #20232c;
            text-align: center;
          `}
        >
          {title}
        </h1>
      </div>

      {children}

      <div
        css={`
          flex: 1;
          width: 100%;
        `}
      >
        <div
          css={`
            padding-top: 100px;
          `}
        >
          {status === 'working' && (
            <p
              css={`
                color: #6d7693;
                text-align: center;
              `}
            >
              This process might take up to a few minutes. Do not close this
              window until the process is finished.
            </p>
          )}

          {status === 'error' && (
            <div
              css={`
                display: grid;
                grid-gap: 12px;
                grid-template-columns: repeat(2, 1fr);
              `}
            >
              <div
                css={`
                  display: flex;
                  justify-content: flex-end;
                `}
              >
                <Button mode="secondary" onClick={onReturnHome}>
                  Abandon process
                </Button>
              </div>

              <div>
                <Button onClick={onRepeatTransaction}>
                  <img
                    src={repeat}
                    alt=""
                    css={`
                      margin-right: 10px;
                    `}
                  />
                  Repeat transaction
                </Button>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div
              css={`
                display: flex;
                justify-content: center;
              `}
            >
              <Button onClick={onReturnHome}>Start new conversion</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

StepperLayout.propTypes = {
  children: PropTypes.node,
  status: PropTypes.oneOf(['working', 'success', 'error']),
  onRepeatTransaction: PropTypes.func,
  onReturnHome: PropTypes.func,
}

export default StepperLayout
