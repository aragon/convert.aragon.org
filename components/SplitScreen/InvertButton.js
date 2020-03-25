import React from 'react'
import styled from 'styled-components/macro'

import arrowImg from './arrow.svg'

function InvertButton({ onClick, label = 'Invert' }) {
  return (
    <button
      onClick={onClick}
      css={`
        white-space: nowrap;
        background: #ffffff;
        border: 0;
        border-radius: 100px;
        width: 64px;
        height: 64px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        outline: 0 !important;
        &::-moz-focus-inner {
          border: 0;
        }
        &:active {
          transform: translateY(1px);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
        }
      `}
    >
      <img width="40" height="40" src={arrowImg} alt={label} />
    </button>
  )
}

export default InvertButton
