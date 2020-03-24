import React, { useState } from 'react'
import 'styled-components/macro'
import Converter from 'components/converter/Converter'
import SplitScreen from 'components/SplitScreen/SplitScreen'
import Logo from 'components/Logo/Logo'
import AmountInput from 'components/AmountInput/AmountInput'

export default () => {
  const [splitVisible, setSplitVisible] = useState(true)
  const [inverted, setInverted] = useState(false)

  const [antValue, setAntValue] = useState('1')
  const [anjValue, setAnjValue] = useState('100')

  return (
    <div
      css={`
        position: relative;
        height: 100vh;
      `}
    >
      <div
        css={`
          position: absolute;
          top: 32px;
          left: 80px;
          z-index: 3;
        `}
      >
        <Logo mode={inverted ? 'ant' : 'anj'} />
      </div>
      <div
        css={`
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        `}
      >
        <SplitScreen
          visible={splitVisible}
          inverted={inverted}
          onInvert={() => setInverted(v => !v)}
          primary={
            inverted ? (
              <AmountInput
                symbol="ANT"
                color={false}
                value={antValue}
                onChange={() => null}
              />
            ) : (
              <AmountInput
                symbol="ANJ"
                color={false}
                value={anjValue}
                onChange={() => null}
              />
            )
          }
          secondary={
            inverted ? (
              <AmountInput
                symbol="ANJ"
                color={true}
                value={anjValue}
                onChange={() => null}
              />
            ) : (
              <AmountInput
                symbol="ANT"
                color={true}
                value={antValue}
                onChange={() => null}
              />
            )
          }
        />
      </div>
      <div
        css={`
          position: absolute;
          z-index: 1;
          top: 0;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <Converter />
      </div>
    </div>
  )
}
