import 'styled-components/macro'
import React, { useImperativeHandle, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { UNSELECTABLE } from 'lib/css-utils'
import { useAnimateWhenMounted, SPRING_SMOOTH } from 'lib/animation-utils'

import arrowImg from './arrow-down.svg'

const WIDTH = 70
const HEIGHT = 70

const InvertButton = React.forwardRef(function InvertButton(
  { onClick, label = 'Invert' },
  ref
) {
  const [position, setPosition] = useState(0)
  const animate = useAnimateWhenMounted()

  const imgTransitions = useSpring({
    immediate: !animate,
    config: SPRING_SMOOTH,
    to: {
      transform: `rotate3d(0, 0, 1, ${position * 360}deg)`,
    },
  })

  useImperativeHandle(
    ref,
    () => ({
      rotate() {
        setPosition(v => v + 1)
      },
    }),
    []
  )

  return (
    <button
      onClick={onClick}
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        white-space: nowrap;
        background: #ffffff;
        border: 0;
        border-radius: 50%;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        outline: 0 !important;
        pointer-events: auto;
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
        height={HEIGHT * 0.76}
        src={arrowImg}
        style={imgTransitions}
        width={WIDTH * 0.76}
        css={`
          transform-origin: 50% 50%;
        `}
      />
    </button>
  )
})

InvertButton.WIDTH = WIDTH
InvertButton.HEIGHT = HEIGHT

export default InvertButton
