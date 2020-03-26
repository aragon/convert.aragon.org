import React from 'react'
import 'styled-components/macro'
import AccountModule from 'components/converter/AccountModule'
import Logo from 'components/Logo/Logo'

function Navbar({ logoMode }) {
  return (
    <div
      css={`
        position: relative;
        z-index: 5;
        width: 100vw;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 16px 40px 0 40px;
      `}
    >
      <Logo mode={logoMode} />
      <AccountModule />
    </div>
  )
}

export default Navbar
