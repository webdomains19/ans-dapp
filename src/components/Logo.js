import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'

import ANSLogo from '../assets/ans-logo.png'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 200px;
  ${mq.medium`
    width: 200px
  `}
`

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  align-items: center;
  width: auto;

  ${mq.medium`
    width: 200px;
  `}
`

const Logo = ({ color, className, to = '' }) => (
  <LogoContainer className={className} to={to}>
    <IconLogo src={ANSLogo} />
  </LogoContainer>
)

export default Logo
