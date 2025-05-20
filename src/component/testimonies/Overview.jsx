import React, {useContext, useState} from 'react'
import userData from '../../data/userdata'
import { Table } from 'antd'

import { DarkModeContext } from '../../context/DarkModeContext';

function Overview() {
  const {isDarkMode} = useContext(DarkModeContext)
  const [tableData, setTableData] = useState(userData)
  
  return (
      <div className='p-5'>
        <h3>Overview</h3>

        {isDarkMode ?
        <>
          <div className='flex items-center justify-between w-[100%] mt-3'>
            <div className={`w-[460px] h-[70px] 
            rounded-xl p-2 ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border"}`}>
              <p className='text-[13px] pl-3 opacity-[0.7]'>Pending Testimonies</p>
              <hr className='w-[95%] m-[auto] mt-1 opacity-[0.5]' />
              <p className='text-[13px] pl-3 pt-3 opacity-[0.5]'>100</p>
            </div>
            <div className={`w-[460px] h-[70px] 
            rounded-xl p-2 ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border"}`}>
              <p className='text-[13px] pl-3 opacity-[0.7]'>Pending Donations</p>
              <hr className='w-[95%] m-[auto] mt-1 opacity-[0.6]' />
              <p className='text-[13px] pl-3 pt-3 opacity-[0.6]'>10</p>
            </div>
          </div>
          <div className='table-container'>
            <table className="custom-table font-san text-[14px]">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Likes</th>
                    <th>Shares</th>
                    <th>Comments</th>
                    <th>Overall</th>
                  </tr>
                </thead>
                {userData.map((data) => (
                    <tbody key={data.id}>
                      <tr>
                        <td>{data.id}</td>
                        <td>{data.category}</td>
                        <td>{data.type}</td>
                        <td>{data.likes}</td>
                        <td>{data.shares}</td>
                        <td>{data.comment}</td>
                        <td>{data.overall}</td>
                      </tr>
                    </tbody>
                ))}
                          
            </table>

          </div>
        </>:""
         }
      </div>
  )
}

export default Overview