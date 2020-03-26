import 'styled-components/macro'
import React from 'react'
import PropTypes from 'prop-types'
import { useViewport } from 'use-viewport'

import anjColor from './anj-color.svg'
import anjWhite from './anj-white.svg'
import antColor from './ant-color.svg'
import antWhite from './ant-white.svg'

function getImage(color, symbol) {
  if (symbol === 'ANT') {
    return color ? antColor : antWhite
  }
  if (symbol === 'ANJ') {
    return color ? anjColor : anjWhite
  }
}

function AmountInput({
  color = true,
  disabled = false,
  symbol,
  value,
  onChange,
}) {
  const viewport = useViewport()
  return (
    <label
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        height: 100%;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          font-size: 24px;
          color: ${color ? '#9096B6' : '#FFF'};
        `}
      >
        <img
          src={getImage(color, symbol)}
          alt=""
          css={`
            margin-right: 12px;
          `}
        />
        <span
          css={`
            position: relative;
            top: 3px;
          `}
        >
          {symbol}
        </span>
      </div>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={'0'}
        css={`
          display: block;
          width: 100%;
          text-align: center;
          font-size: ${viewport.below(414) ? '36px' : '88px'};
          font-weight: 600;
          color: ${color ? '#1c1c1c' : '#FFF'};
          background: transparent;
          border: 0;
          outline: none;
          &::placeholder {
            color: ${color ? '#1c1c1c' : '#FFF'};
          }
          @media screen and (max-width: 414px) {
            font-size: 36px;
          }
        `}
      />
    </label>
  )
}

AmountInput.propTypes = {
  color: PropTypes.bool,
  symbol: PropTypes.oneOf(['ANT', 'ANJ']).isRequired,
}

export default AmountInput
