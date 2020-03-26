import { css } from 'styled-components'

// These breakpoints values represent minimum screen sizes.
export const BREAKPOINTS = {
  min: 320,
  small: 540,
  medium: 768,
  large: 1170,
}

// CSS breakpoints
export const breakpoint = (name, styles) => css`
  @media (min-width: ${BREAKPOINTS[name]}px) {
    ${styles};
  }
`

export const GU = 8
