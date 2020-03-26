import React from 'react'
import PropTypes from 'prop-types'
import AccountModule from 'components/AccountModule/AccountModule'
import Logo from 'components/Logo/Logo'

function NavBar({ logoMode }) {
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

NavBar.propTypes = {
  logoMode: PropTypes.string,
}

export default NavBar
