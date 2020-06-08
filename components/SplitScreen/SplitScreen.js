import React, { useEffect, useMemo, useRef } from 'react'
import { useSpring, useTransition, animated } from 'react-spring'
import { useAnimateWhenMounted, SPRING_FAST } from 'lib/animation-utils'
import { ABSOLUTE_FILL } from 'lib/css-utils'
import InvertButton from './InvertButton'

import illustrationAnt from './banner-illustration-ant.svg'
import illustrationAnj from './banner-illustration-anj.svg'

const BANNER_ANT = [illustrationAnt, '304deg, #01E8F7 18%, #00C2FF 80%']
const BANNER_ANJ = [illustrationAnj, '208deg, #FFB36D 6%,  #FF8888 93%']

const REVEAL_SCALE_FROM = 0.9
const REVEAL_OVERLAY_OPACITY = 0.1

function SplitScreen({ inverted, onInvert, reveal, primary, secondary }) {
  const invertButtonRef = useRef(null)
  const animate = useAnimateWhenMounted()
  const opened = Boolean(reveal)

  const status = useMemo(() => ({ inverted, opened }), [inverted, opened])
  const statusTransitionKey = status => Object.values(status).join('')

  const primaryTransitions = useTransition(status, statusTransitionKey, {
    config: SPRING_FAST,
    immediate: !animate,
    from: {
      transform: `
        translate3d(0, calc(-100%  - ${InvertButton.HEIGHT / 2}px), 0)
      `,
    },
    enter: {
      transform: 'translate3d(0, calc(0% - 0px), 0)',
    },
    leave: {
      transform: `
        translate3d(0, calc(-100%  - ${InvertButton.HEIGHT / 2}px), 0)
      `,
    },
  })

  const secondaryTransitions = useTransition(status, statusTransitionKey, {
    config: SPRING_FAST,
    immediate: !animate,
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

  const revealTransition = useTransition(reveal, null, {
    config: SPRING_FAST,
    from: {
      transform: `scale3d(${REVEAL_SCALE_FROM}, ${REVEAL_SCALE_FROM}, 1)`,
      overlayOpacity: 1,
    },
    enter: {
      transform: 'scale3d(1, 1, 1)',
      overlayOpacity: 0,
    },
    leave: {
      transform: `scale3d(${REVEAL_SCALE_FROM}, ${REVEAL_SCALE_FROM}, 1)`,
      overlayOpacity: 1,
    },
  })

  const buttonTransition = useSpring({
    config: SPRING_FAST,
    to: {
      transform: `
        scale(${opened ? 2 : 1})`,
      opacity: opened ? 0 : 1,
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
        ${ABSOLUTE_FILL};
        background: #f9fafc;
      `}
    >
      {revealTransition.map(
        ({ item, key, props }) =>
          item && (
            <div
              key={key}
              css={`
                ${ABSOLUTE_FILL};
                z-index: 1;
                display: flex;
                align-items: center;
                flex-direction: column;
              `}
            >
              <animated.div
                style={{
                  display: props.overlayOpacity.interpolate(v =>
                    v === 0 ? 'none' : 'block'
                  ),
                  opacity: props.overlayOpacity,
                }}
                css={`
                  ${ABSOLUTE_FILL};
                  z-index: 2;
                  background: rgba(0, 0, 0, ${REVEAL_OVERLAY_OPACITY});
                  pointer-events: none;
                `}
              />
              <animated.div
                style={{ transform: props.transform }}
                css={`
                  ${ABSOLUTE_FILL};
                  z-index: 1;
                `}
              >
                {item}
              </animated.div>
            </div>
          )
      )}
      <div
        css={`
          ${ABSOLUTE_FILL};
          z-index: 2;
          display: flex;
          align-items: center;
          flex-direction: column;
          pointer-events: ${reveal ? 'none' : 'auto'};
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
            ({ item: { inverted, opened }, key, props }) => {
              const [image, gradient] = inverted ? BANNER_ANJ : BANNER_ANT
              return opened ? null : (
                <animated.div
                  key={key}
                  style={props}
                  css={`
                    ${ABSOLUTE_FILL};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    background: 50% 100% / contain no-repeat url(${image}),
                      linear-gradient(${gradient}) !important;
                  `}
                >
                  {primary}
                </animated.div>
              )
            }
          )}
        </div>
        <animated.div
          css={`
            ${ABSOLUTE_FILL};
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
            z-index: 3;
          `}
          style={buttonTransition}
        >
          <InvertButton ref={invertButtonRef} onClick={onInvert} />
        </animated.div>
        <div
          css={`
            position: relative;
            width: 100%;
            height: 50%;
          `}
        >
          {secondaryTransitions.map(
            ({ item: { inverted, opened }, key, props: { transform } }) => {
              return opened ? null : (
                <animated.div
                  key={key}
                  style={{ transform }}
                  css={`
                    ${ABSOLUTE_FILL};
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
    </div>
  )
}

export default SplitScreen
