import React from 'react'
import { Chart as ChartJs, Tooltip, Legend, ArcElement, plugins, layouts } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { textTestimonyPieChatData } from '../../data/analyticTextTest'

ChartJs.register(Tooltip, Legend, ArcElement)

function AnalyticVideoTestimony() {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        rotation: Math.PI * 35,
        plugins:{
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 30,
                    boxHeight: 15,
                    padding: 20
                }
            }
        }
      };

    return (
        <div className='w-[98%] h-[200px] m-auto'>
            <div className='w-[660px] h-[300px] m-auto p-1 mb-8'>
               <Pie data={textTestimonyPieChatData} options={options} />
            </div>
        </div>
       
    )
}

export default AnalyticVideoTestimony
