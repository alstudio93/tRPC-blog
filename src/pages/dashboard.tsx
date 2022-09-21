import { useRouter } from 'next/router'
import React from 'react'
import AuthWrapper from '../components/AuthWrapper'

const Dashboard = (props) => {

  const router = useRouter();


  

  return (
    <AuthWrapper redirect="dashboard">
        Dashboard
    </AuthWrapper>
  )
}

export default Dashboard