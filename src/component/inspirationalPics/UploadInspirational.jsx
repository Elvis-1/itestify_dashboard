import React, { useState } from 'react';
import { Upload, Progress, Button, Radio, message } from 'antd';
import { FaImage, FaTimes } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import axios from 'axios';

import '../../App.css'

function UploadInspirational() {
  const [uploadStatus, setUploadStatus] = useState('Upload');
  const [timePeriod, setTimePeriod] = useState('PM');
  const [showTimePeriod, setShowTimePeriod] = useState(false);
  const [dateScheduled, setDateSchedule] = useState('');
  const [timeData, setTimeData] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [sourceInput, setSourceInput] = useState('')

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const newProgress = { ...uploadProgress };
    newFileList.forEach(file => {
      if (!uploadProgress[file.uid] && !file.url) {
        newProgress[file.uid] = 0;
      }
    });
    setUploadProgress(newProgress);
  };

  const simulateUpload = (uid) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({
        ...prev,
        [uid]: progress
      }));
    }, 500);
    return interval;
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  console.log("Token:", token);
  
  if (fileList.length === 0) {
    message.error("Please select files to upload.");
    return;
  }

  try {
    if (!token) {
      message.error("You must be logged in to upload files.");
      return;
    }

    const uploadedFiles = [];
    for (const file of fileList) {
      try {
        const progressInterval = simulateUpload(file.uid);

        const formData = new FormData();
        formData.append('thumbnail', file.originFileObj);

        let backendStatus;
        switch(uploadStatus) {
          case 'Upload': 
            backendStatus = 'upload_now';
            break;
          case 'Draft': 
            backendStatus = 'drafts';
            break;
          case 'Schedule': 
            backendStatus = 'scheduled';
            formData.append('date_scheduled', dateScheduled);
            formData.append('time_scheduled', `${timeData} ${timePeriod}`);
            break;
          default:
            backendStatus = 'drafts';
        }
        
        formData.append('status', backendStatus);
        formData.append('source', sourceInput);


        const response = await axios.post(
          'https://itestify-backend-38u1.onrender.com/inspirational/create_pic/',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [file.uid]: 100 }));

        uploadedFiles.push(response.data);
        console.log('Upload successful:', response.data);

      } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
        setUploadProgress(prev => ({ ...prev, [file.uid]: 0 }));
        message.error(`Failed to upload ${file.name}: ${error.response?.data?.detail || error.message}`);
        clearInterval(simulateUpload(file.uid));
      }
    }

    if (uploadedFiles.length > 0) {
      message.success("Files uploaded successfully!");
      setFileList([]);
      setUploadProgress({});
    }

  } catch (error) {
    console.error("System error:", error);
    message.error("An error occurred while uploading files. Please try again.");
  }
};


  const removeFile = (uid) => {
    setFileList(prev => prev.filter(file => file.uid !== uid));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[uid];
      return newProgress;
    });
  };

  const uploadProps = {
    multiple: true,
    onChange: handleUploadChange,
    beforeUpload: () => false,
    fileList,
    accept: "image/*",
    showUploadList: false,
    listType: "picture-card"
  };

  return (
    <div className="w-[90%] m-[auto]">
      {/* Header with Upload Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Upload Pictures</h2>
        <button 
          onClick={handleSubmit}
          className="bg-[#b584e6] hover:bg-[#8a5ac4] border-none text-white w-[100px]
          p-2 rounded"
          size="large"
        >
          {uploadStatus}
        </button>
      </div>

      {/* Drag and Drop Area - Full Width */}
      <div className="w-full mb-6">
        <Upload.Dragger {...uploadProps} className="w-full h-64 bg-[#171717] rounded-xl flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center">
            <FaImage size={48} className="text-[#9966CC] mb-4" />
            <p className="text-lg">Drag and drop images here</p>
            <p className="text-[#9966CC]">or click to browse files</p>
            <p className="text-sm mt-2">Supports: JPG, PNG, GIF (Max 200MB each)</p>
          </div>
        </Upload.Dragger>
      </div>

      
      
      {/* Upload Progress Section */}
{fileList.length > 0 && (
  <div className="flex h-[60px] mb-8">
    <div className="bg-[#171717] rounded-lg p-5 mr-4">
      <input onChange={(e)=> setSourceInput(e.target.value)}
        type="text" 
        placeholder="Enter source" 
        className="bg-transparent outline-none text-white w-full"
      />
    </div>
    
    <div className="flex-1 space-y-4">
      {fileList.map(file => (
        <div key={file.uid} className="bg-[#171717] p-4 rounded-lg">
          <div className="flex items-start">
            {file.type?.startsWith('image/') && (
              <div className="w-10 h-10 mr-4 flex-shrink-0">
                <img 
                  src={file.thumbUrl || URL.createObjectURL(file.originFileObj)} 
                  alt={file.name} 
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>{Math.round(file.size / 1024)} KB</span>
                    <span>{uploadProgress[file.uid] || 0}%</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFile(file.uid)}
                  className="text-gray-400 hover:text-white ml-4"
                >
                  <FaTimes color="red" />
                </button>
              </div>
              
              <Progress 
                percent={uploadProgress[file.uid] || 0} 
                strokeColor="#9966CC" 
                showInfo={false}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Upload Options */}
      <div className="w-full mt-20 bg-[#171717] p-5 rounded-xl">
        <Radio.Group 
          value={uploadStatus} 
          onChange={(e) => setUploadStatus(e.target.value)}
          className="w-full"
        >
          <div className="space-y-4">
            <Radio 
              value="Upload" 
              className="custom-radio"
              style={{ '--radio-color': '#9966CC' }}
            >
              <span className={`ml-2 text-white`}>Upload Now</span>
            </Radio>
            
            <Radio 
              value="Schedule" 
              className="custom-radio"
              
            >
              <span className="ml-2 text-white">Schedule For Later</span>
            </Radio>
            
            <Radio 
              value="Draft" 
              className="custom-radio"
              style={{ '--radio-color': '#9966CC' }}
            >
              <span className="ml-2 text-white">Save as Draft</span>
            </Radio>
          </div>
        </Radio.Group>

        {uploadStatus === 'Schedule' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm mb-2">Schedule Date</label>
              <input
                type="date"
                value={dateScheduled}
                onChange={(e) => setDateSchedule(e.target.value)}
                className="bg-[#2D2D2D] text-white rounded p-2 w-full outline-none border-none"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-2">Time</label>
                <input
                  type="time"
                  value={timeData}
                  onChange={(e) => setTimeData(e.target.value)}
                  className="bg-[#2D2D2D] text-white rounded p-2 w-full outline-none border-none"
                />
              </div>
              
              <div className="flex-1 relative">
                <label className="block text-sm mb-2">AM/PM</label>
                <div 
                  onClick={() => setShowTimePeriod(!showTimePeriod)}
                  className="bg-[#2D2D2D] text-white rounded p-2 w-full flex justify-between items-center cursor-pointer"
                >
                  {timePeriod}
                  {showTimePeriod ? <FaCaretUp /> : <FaCaretDown />}
                </div>
                
                {showTimePeriod && (
                  <div className="absolute z-10 w-full bg-[#2D2D2D] rounded mt-1 overflow-hidden">
                    <div 
                      className="p-2 hover:bg-[#3D3D3D] cursor-pointer"
                      onClick={() => {
                        setTimePeriod("AM");
                        setShowTimePeriod(false);
                      }}
                    >
                      AM
                    </div>
                    <div 
                      className="p-2 hover:bg-[#3D3D3D] cursor-pointer"
                      onClick={() => {
                        setTimePeriod("PM");
                        setShowTimePeriod(false);
                      }}
                    >
                      PM
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadInspirational;