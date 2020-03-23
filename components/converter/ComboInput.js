import React, { useState, useEffect, useCallback, useRef } from 'react'
import 'styled-components/macro'
import { animated, useSpring, useTransition } from 'react-spring'
import arrowSvg from './assets/arrow.svg'

const ESCAPE_KEY = 27
const noop = () => {}
const SPRING = { mass: 0.4, tension: 400, friction: 20 }

function ComboInput({
  inputValue,
  onBlur = noop,
  onChange = noop,
  onFocus = noop,
  onSelect = noop,
  options = [],
  placeholder,
  selectedOption = 0,
}) {
  const [opened, setOpened] = useState(false)
  const buttonRef = useRef()
  const menuRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    if (opened && menuRef.current) {
      menuRef.current.focus()
    }
  }, [opened])

  const handleSelect = useCallback(
    optionIndex => {
      setOpened(opened => !opened)
      onSelect(optionIndex)
    },
    [onSelect]
  )

  const handleDropdownBlur = useCallback(event => {
    const focused = event.relatedTarget
    if (focused === buttonRef.current || menuRef.current.contains(focused)) {
      return
    }
    if (event.relatedTarget && !event.relatedTarget.id) {
      setOpened(false)
    }
  }, [])

  const handleDropdownKeyDown = useCallback(event => {
    if (event.keyCode === ESCAPE_KEY) {
      setOpened(false)
      inputRef.current.focus()
    }
  }, [])

  const handleButtonClick = useCallback(() => {
    setOpened(isOpen => !isOpen)
  }, [])

  return (
    <div
      css={`
        position: relative;
        z-index: 1;
        width: 100%;
        height: 50px;
        background: #ffffff;
        display: flex;
        padding: 0;
      `}
    >
      <input
        ref={inputRef}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        value={inputValue}
        css={`
          position: absolute;
          z-index: 1;
          width: 100%;
          height: 50px;
          padding: 6px 12px 0;
          background: #ffffff;
          border: 1px solid #dde4e9;
          color: #212b36;
          border-radius: 4px 4px 4px 4px;
          appearance: none;
          font-size: 20px;
          font-weight: 400;
          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button {
            -webkit-appearance: none;
          }
          -moz-appearance: textfield;
          &:focus {
            outline: none;
            border-color: #08bee5;
          }
          &::placeholder {
            color: #8fa4b5;
            opacity: 1;
          }
          &:invalid {
            box-shadow: none;
          }
        `}
      />
      <DropdownButton
        ref={buttonRef}
        onClick={handleButtonClick}
        label={options[selectedOption]}
        opened={opened}
      />
      <DropDownMenu
        ref={menuRef}
        items={options}
        onBlur={handleDropdownBlur}
        onKeyDown={handleDropdownKeyDown}
        onSelect={handleSelect}
        opened={opened}
      />
    </div>
  )
}

const DropdownButton = React.forwardRef(function DropdownButton(
  { onClick, label, opened },
  ref
) {
  const arrowStyle = useSpring({
    transform: `rotate(${180 * (1 - Number(opened))}deg)`,
    config: SPRING,
  })

  return (
    <button
      ref={ref}
      onClick={onClick}
      type="button"
      css={`
        position: absolute;
        right: 0;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        padding: 0 0 0 10px;
        color: #212b36;
        background: transparent;
        border: 1px solid #dde4e9;
        border-width: 0 0 0 1px;
        border-radius: 0 4px 4px 0;
        outline: 0;
        transition: none;
        cursor: pointer;
        &::-moz-focus-inner {
          border: 0;
        }
        &:after {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 0 4px 4px 0;
          border: 1px solid #08bee5;
        }
        &:focus {
          outline: 0;
        }
        &:focus:after {
          content: '';
        }
      `}
    >
      <div>{label}</div>
      <div
        css={`
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 18px;
          width: 30px;
          margin-left: -6px;
        `}
      >
        <animated.img
          src={arrowSvg}
          alt=""
          style={arrowStyle}
          css="transform-origin: 50% 50%"
        />
      </div>
    </button>
  )
})

const DropDownMenu = React.forwardRef(function DropDownMenu(
  { items, onBlur, onKeyDown, opened, onSelect },
  ref
) {
  const transitions = useTransition(opened, null, {
    from: { opacity: 0, transform: 'scale3d(0.95, 0.95, 1)' },
    enter: { opacity: 1, transform: 'scale3d(1, 1, 1)' },
    leave: { opacity: 0, transform: 'scale3d(0.95, 0.95, 1)' },
    config: SPRING,
  })

  return (
    <>
      {transitions.map(({ item, key, props: style }) => {
        return (
          item && (
            <div
              key={key}
              ref={ref}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              tabIndex="0"
              css={`
                position: absolute;
                z-index: 3;
                top: 100%;
                right: 0;
                outline: 0;

                // Center mode:
                // top: 50%;
                // transform: translateY(-50%);
              `}
            >
              <animated.ul
                style={{
                  ...style,
                  pointerEvents: opened ? 'auto' : 'none',
                }}
                css={`
                  overflow: hidden;
                  margin: 0;
                  padding: 0;
                  min-width: 130px;
                  border: 1px solid #dde6ed;
                  border-radius: 4px;
                  background: white;
                  list-style: none;
                  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
                  transform-origin: 50% 0;
                  li {
                    width: 100%;
                    height: 100%;
                  }
                `}
              >
                {items.map((item, index) => (
                  <li key={index}>
                    <MenuItem id={index} label={item} onSelect={onSelect} />
                  </li>
                ))}
              </animated.ul>
            </div>
          )
        )
      })}
    </>
  )
})

function MenuItem({ id, label, onSelect }) {
  const handleClick = useCallback(() => {
    onSelect(id)
  }, [onSelect, id])
  return (
    <button
      onClick={handleClick}
      type="button"
      css={`
        position: relative;
        border: none;
        padding: 0;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 0 24px 0 10px;
        background: transparent;
        transition: none;
        outline: 0;
        cursor: pointer;
        &::-moz-focus-inner {
          border: 0;
        }
        :hover,
        :focus {
          background: #f3f8fc;
          outline: 0;
        }
      `}
    >
      {label}
    </button>
  )
}

export default ComboInput
