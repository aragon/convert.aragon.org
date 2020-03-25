import React, { useEffect, useRef } from 'react'

export const SPRING_SMOOTH = { tension: 150, friction: 30 }
// Use this spring to debug transitions
// export const SPRING_SMOOTH = { mass: 1, tension: 10, friction: 40 }

// Don’t animate initially
export function useAnimateWhenMounted() {
  const animate = useRef(false)

  useEffect(() => {
    animate.current = true
  }, [])

  return animate.current
}
