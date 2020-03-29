import React, { useMemo } from 'react'
import Button from './Button'
import PropTypes from 'prop-types'
import { css } from 'styled-components'
import repeat from './assets/repeat.svg'

const smallCaps = css`
  font-size: 32px;
`

function getTitle(fromAmount, toAmount, stage, toAnj) {
  const convertTitle = (
    <>
      Convert {fromAmount} <span css={smallCaps}>{toAnj ? 'ANT' : 'ANJ'}</span>{' '}
      to <span css={smallCaps}>{toAnj ? 'ANJ' : 'ANT'}</span>
    </>
  )

  const successTitle = (
    <>
      You successfully converted <br />
      {fromAmount} <span css={smallCaps}>{toAnj ? 'ANT' : 'ANJ'}</span> to{' '}
      {toAmount} <span css={smallCaps}>{toAnj ? 'ANJ' : 'ANT'}</span>
    </>
  )

  if (stage === 'working' || stage === 'error') {
    return convertTitle
  } else if (stage === 'success') {
    return successTitle
  }
}

function StepperLayout({ children, fromAmount, toAmount, stage, toAnj }) {
  const title = useMemo(() => getTitle(fromAmount, toAmount, stage, toAnj), [
    fromAmount,
    toAmount,
    stage,
    toAnj,
  ])

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

      <div
        css={`
          display: flex;
        `}
      >
        {children}
      </div>

      <div
        css={`
          flex: 1;
          width: 100%;
        `}
      >
        <div
          css={`
            padding-top: 90px;
          `}
        >
          {stage === 'working' && (
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

          {stage === 'error' && (
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
                <Button mode="secondary">Abandon process</Button>
              </div>

              <div>
                <Button>
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

          {stage === 'success' && (
            <div
              css={`
                display: flex;
                justify-content: center;
              `}
            >
              <Button>Start new conversion</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  anjCount: PropTypes.number,
  antCount: PropTypes.number,
  toAnj: PropTypes.bool,
  stage: PropTypes.oneOf(['working', 'success', 'error']),
}

export default StepperLayout
