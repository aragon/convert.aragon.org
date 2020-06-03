import { useState, useEffect, useRef } from 'react'
import { useViewport } from 'use-viewport'

// It's important to default to the large layout
// so that the inner bounds max size can be calculated on first render
const INITIAL_LAYOUT = 'large'

function useStepLayout({ boundsOffset = 0 }) {
  const { width } = useViewport()
  const [stepLayoutName, setStepLayoutName] = useState(INITIAL_LAYOUT)
  const [innerBoundsWidth, setInnerBoundsWidth] = useState()
  const stepperBoundsRef = useRef(null)

  useEffect(() => {
    // Only query DOM for offsetWidth once
    if (!innerBoundsWidth) {
      setInnerBoundsWidth(stepperBoundsRef.current.offsetWidth)
    }

    if (width - boundsOffset < innerBoundsWidth && stepLayoutName !== 'small') {
      setStepLayoutName('small')
    }

    if (width - boundsOffset > innerBoundsWidth && stepLayoutName !== 'large') {
      setStepLayoutName('large')
    }
  }, [width, innerBoundsWidth, stepLayoutName, boundsOffset])

  return [stepperBoundsRef, stepLayoutName]
}

export default useStepLayout
