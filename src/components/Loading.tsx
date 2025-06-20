/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react'

const Loading = () => {
  return (
    <div className='flex items-center justify-center h-screen w-screen absolute top-0 left-0 z-[9999] bg-foreground'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-black'></div>
    </div>
  )
}
export default Loading
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
