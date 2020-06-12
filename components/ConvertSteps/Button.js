import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'styled-components'

const MODE_STYLE = {
  primary: css`
    background: linear-gradient(189.76deg, #ffb36d 6.08%, #ff8888 93.18%);
    border: solid 0px transparent;
    color: white;
  `,
  secondary: css`
    background-color: #ffffff;
    border: solid 1px #c7d1da;
    color: #212b36;
  `,
}

function Button({ className, children, mode, disabled, onClick }) {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      css={`
        ${MODE_STYLE[mode]}

        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);

        border-radius: 6px;

        padding-left: 30px;
        padding-right: 30px;
        width: 100%;
        max-width: 272px;
        height: 52px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;

        &:disabled,
        &[disabled] {
          opacity: 0.5;
          cursor: inherit;
        }

        &:active {
          transform: translateY(1px);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
        }
      `}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  mode: PropTypes.oneOf(['primary', 'secondary']),
}

Button.defaultProps = {
  mode: 'primary',
}

export default Button
