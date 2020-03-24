import React, { useEffect, useRef } from 'react'
import 'styled-components/macro'
import { useTransition, animated } from 'react-spring'

import logo from './logo.svg'
import logoAnt from './logo-ant.svg'
import logoAnj from './logo-anj.svg'

const SPRING_CONFIG = { tension: 210, friction: 20 }

function getImage(mode) {
  if (mode == 'ant') {
    return logoAnt
  }
  if (mode == 'anj') {
    return logoAnj
  }
  return logo
}

function Logo({ label = 'Aragon Bonding Curve Converter', onClick, mode }) {
  // Don’t animate initially
  const animate = useRef(false)
  useEffect(() => {
    animate.current = true
  }, [])

  const modeTransition = useTransition(mode, null, {
    immediate: !animate.current,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <button
      onClick={onClick}
      css={`
        position: relative;
        display: flex;
        width: 68px;
        height: 68px;
        padding: 0;
        white-space: nowrap;
        border: 0;
        cursor: pointer;
        outline: 0 !important;
        background: transparent;
        &::-moz-focus-inner {
          border: 0;
        }
        &:active {
          transform: translateY(1px);
        }
      `}
    >
      {modeTransition.map(({ item: mode, key, props: { opacity } }) => (
        <animated.img
          key={key}
          alt={label}
          src={getImage(mode)}
          style={{ opacity }}
          css={`
            position: absolute;
            top: 0;
            left: 0;
          `}
        />
      ))}
    </button>
  )
}

export default Logo
