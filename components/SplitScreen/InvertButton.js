import React, { useImperativeHandle, useState } from 'react'
import styled from 'styled-components/macro'
import { useSpring, animated } from 'react-spring'
import { UNSELECTABLE } from 'lib/css-utils'
import { SPRING_SMOOTH } from 'lib/animation-utils'

import arrowImg from './arrow-down.svg'

const InvertButton = React.forwardRef(function InvertButton(
  { onClick, label = 'Invert' },
  ref
) {
  const [position, setPosition] = useState(0)

  const imgTransitions = useSpring({
    config: SPRING_SMOOTH,
    transform: `rotate3d(0, 0, 1, ${position * 360}deg)`,
  })

  useImperativeHandle(ref, () => ({
    rotate() {
      setPosition(v => v + 1)
    },
  }))

  return (
    <button
      onClick={onClick}
      css={`
        padding: 13px;
        white-space: nowrap;
        background: #ffffff;
        border: 0;
        border-radius: 100px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        outline: 0 !important;
        ${UNSELECTABLE};
        transition: transform 75ms ease-in-out;
        &::-moz-focus-inner {
          border: 0;
        }
        &:active {
          transform: translateY(1px);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
        }
      `}
    >
      <animated.img
        alt={label}
        height="54"
        src={arrowImg}
        style={imgTransitions}
        width="54"
        css={`
          transform-origin: 50% 50%;
        `}
      />
    </button>
  )
})

export default InvertButton
