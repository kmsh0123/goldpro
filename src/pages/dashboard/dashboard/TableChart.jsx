import React from 'react'
import Chart from './Chart'
import StockAlert from './StockAlert'

const TableChart = () => {
  return (
    <div className='grid grid-cols-12 gap-5'>
      <div className='col-span-8 border-t-4 border-[#4ca64c] rounded-lg'><Chart/></div>
      <div className='col-span-4 border-t-4 border-[#0073b7] rounded-lg'><StockAlert/></div>
      
    </div>
  )
}

export default TableChart