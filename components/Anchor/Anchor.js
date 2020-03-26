import React from 'react'

function Anchor({ href, external = true, children, ...props }) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <a href={href} {...externalProps} {...props}>
      {children}
    </a>
  )
}

export default Anchor
