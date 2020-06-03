import { useState, useEffect, useRef } from 'react'
import useMeasure from 'react-use-measure'
import { ResizeObserver as Polyfill } from '@juggle/resize-observer'

// It's important to default to the large layout
// so that the inner bounds max size can be calculated on first render
const INITIAL_LAYOUT = 'large'

function useStepLayout(boundsOffset = 0) {
  const [layoutName, setLayoutName] = useState(INITIAL_LAYOUT)
  const [innerBoundsWidth, setInnerBoundsWidth] = useState()
  const [outerBoundsRef, outerBounds] = useMeasure({ Polyfill })
  const innerBoundsRef = useRef(null)

  useEffect(() => {
    // Only query for inner bounds width when needed
    if (!innerBoundsWidth) {
      setInnerBoundsWidth(innerBoundsRef.current.offsetWidth)
    }

    if (
      outerBounds.width - boundsOffset < innerBoundsWidth &&
      layoutName !== 'small'
    ) {
      setLayoutName('small')
    }

    if (
      outerBounds.width - boundsOffset > innerBoundsWidth &&
      layoutName !== 'large'
    ) {
      setLayoutName('large')
    }
  }, [outerBounds.width, innerBoundsWidth, layoutName, boundsOffset])

  return [outerBoundsRef, innerBoundsRef, layoutName]
}

export default useStepLayout
