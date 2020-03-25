import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import { useTransition, animated } from 'react-spring'
import { SPRING_SMOOTH } from 'lib/animation-utils'
import InvertButton from './InvertButton'

import backgroundAnt from './converter-background-ant.svg'
import backgroundAnj from './converter-background-anj.svg'

function SplitScreen({
  converting,
  inverted,
  onConvert,
  onInvert,
  primary,
  secondary,
}) {
  const invertButtonRef = useRef(null)

  // Don’t animate initially
  const animate = useRef(false)
  useEffect(() => {
    animate.current = true
  }, [])

  const primaryTransitions = useTransition(inverted, null, {
    config: SPRING_SMOOTH,
    immediate: !animate.current,
    from: {
      transform: 'translate3d(0, -100%, 0)',
    },
    enter: {
      transform: 'translate3d(0, 0%, 0)',
    },
    leave: {
      transform: 'translate3d(0, -100%, 0)',
    },
  })

  const secondaryTransitions = useTransition(inverted, null, {
    config: SPRING_SMOOTH,
    immediate: !animate.current,
    from: {
      transform: 'translate3d(0, 100%, 0)',
    },
    enter: {
      transform: 'translate3d(0, 0%, 0)',
    },
    leave: {
      transform: 'translate3d(0, 100%, 0)',
    },
  })

  useEffect(() => {
    if (invertButtonRef.current) {
      invertButtonRef.current.rotate()
    }
  }, [inverted])

  return (
    <div
      css={`
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
      `}
    >
      <div
        css={`
          position: relative;
          width: 100%;
          height: 50%;
        `}
      >
        {primaryTransitions.map(
          ({ item: inverted, key, props: { transform } }) => {
            const image = inverted ? backgroundAnj : backgroundAnt
            return (
              <animated.div
                key={key}
                style={{ transform }}
                css={`
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  height: 100%;
                  background: #000 50% 50% / cover no-repeat url(${image});
                `}
              >
                {primary}
              </animated.div>
            )
          }
        )}
      </div>
      <div
        css={`
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        `}
      >
        <InvertButton ref={invertButtonRef} onClick={onInvert} />
      </div>
      <div
        css={`
          position: relative;
          width: 100%;
          height: 50%;
        `}
      >
        {secondaryTransitions.map(
          ({ item: inverted, key, props: { transform } }) => {
            return (
              <animated.div
                key={key}
                style={{ transform }}
                css={`
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  height: 100%;
                  background: #fff;
                `}
              >
                {secondary}
              </animated.div>
            )
          }
        )}
      </div>
    </div>
  )
}

export default SplitScreen
