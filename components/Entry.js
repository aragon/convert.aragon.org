import React from 'react'
import styled from 'styled-components'
import { breakpoint } from 'lib/microsite-logic'

const medium = css => breakpoint('medium', css)

const Entry = ({ children, entrypoint, lastpoint }) => (
  <EntryBox>
    {entrypoint && <div className="entry-point" />}
    {lastpoint && <div className="last-point" />}
    <div className="content">{children}</div>
  </EntryBox>
)

const EntryBox = styled.div`
  clear: both;
  text-align: left;
  position: relative;
  .entry-point {
    width: 33%;
    position: relative;
  }
  .entry-point:after,
  .last-point:after {
    content: '';
    position: absolute;
    width: 9px;
    height: 9px;
    border-radius: 12px;
    top: 6px;
    left: 4px;
    border: solid 2px #ff9780;
    background: white;
    ${medium('left: -34.5px;')};
  }
  .entry-point:before,
  .last-point:before {
    content: '';
    width: 32px;
    height: 32px;
    border-radius: 30px;
    opacity: 0.2;
    border: 3px solid #ff9780;
    mix-blend-mode: normal;
    position: absolute;
    left: -3px;
    top: -5px;
    ${medium('left: -47px;')};
  }
  .content {
    margin: 0 0 2em;
    float: right;
    width: 90%;
    padding-left: 5px;
    position: relative;
    ${medium('width: 100%;')};
  }
`

export default Entry
