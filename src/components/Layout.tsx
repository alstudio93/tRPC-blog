import React, { useEffect, useState } from 'react'

const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
    
  const [onComponentMount, setOnComponentMount] = useState(false)

  useEffect(()=> {
    setOnComponentMount(true);
  }, [])
  return (
    <>
    {
        onComponentMount && (
            {children}
        )
    }
    </>
  )
}

export default Layout