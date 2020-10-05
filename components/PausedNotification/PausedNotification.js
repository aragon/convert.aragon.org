import React from 'react'
import styled from 'styled-components'
import anjColor from '../AmountInput/anj-color.svg'
import antColor from '../AmountInput/ant-color.svg'
import logoAnj from '../Logo/logo-anj.svg'

function PausedNotification() {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
        padding: 20px;
        overflow-y: auto;
      `}
    >
      <img
        alt="Aragon Bonding Curve Converter"
        src={logoAnj}
        css={`
          position: absolute;
          top: 30px;
          left: 30px;
        `}
      />
      <div
        css={`
          position: relative;
          background-color: white;
          text-align: center;
          padding: 50px;
          max-width: 625px;
          border-radius: 12px;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
          z-index: 2;
          margin: auto;
        `}
      >
        <h1
          css={`
            margin-bottom: 25px;
            line-height: 1.15;
          `}
        >
          ANJ : ANT trading has been&nbsp;paused
        </h1>
        <p>
          The ANJ : ANT bonding curve has been paused by the Aragon Network's
          Governor Council in response to the{' '}
          <a
            href="https://gov.aragon.org/#/aragon/proposal/QmNTgjdR3rNj25Ah6PxYzAzb8cD7cT6HmKoFFmKADrr2gC"
            target="_blank"
            rel="noopener noreferrer"
          >
            proposal to merge ANT and ANJ
          </a>
          .
        </p>
        <p>The currently paused price of ANJ : ANT is:</p>
        <h2
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 30px;
            margin-bottom: 35px;
          `}
        >
          <img
            src={anjColor}
            alt=""
            width="23"
            height="25"
            css={`
              margin-right: 12px;
            `}
          />
          1.000
          <span
            css={`
              opacity: 0.5;
              margin-left: 12px;
              margin-right: 12px;
            `}
          >
            :
          </span>
          <img
            src={antColor}
            alt=""
            width="25"
            height="25"
            css={`
              margin-right: 6px;
            `}
          />
          0.015
        </h2>

        <Button
          href="https://aragon.org/blog/merge-anj"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </Button>
      </div>
    </div>
  )
}

const Button = styled.a`
  align-items: center;
  justify-content: center;
  display: flex;
  background: linear-gradient(189.76deg, #ffb36d 6.08%, #ff8888 93.18%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border: solid 0px transparent;
  border-radius: 6px;
  color: white !important;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;
  height: 48px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
  &:disabled,
  &[disabled] {
    opacity: 0.5;
    cursor: inherit;
  }
`

export default PausedNotification
