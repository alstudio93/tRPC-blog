import React from 'react'
import AuthWrapper from '../components/AuthWrapper'

const AuthenticatedRoute = (props) => {
  return (
    <AuthWrapper redirect="authenticated">
        Authenticated Route!
    </AuthWrapper>
  )
}

export default AuthenticatedRoute