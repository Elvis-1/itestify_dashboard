import React, { useState } from 'react';
import { Upload, Progress, Button, Radio } from 'antd';
import { FaImage, FaTimes } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import '../../App.css'

function UploadInspirational() {
  const [uploadStatus, setUploadStatus] = useState('Upload');
  const [timePeriod, setTimePeriod] = useState('PM');
  const [showTimePeriod, setShowTimePeriod] = useState(false);
  const [dateScheduled, setDateSchedule] = useState('');
  const [timeData, setTimeData] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const uploadData = {
      uploadStatus,
      files: fileList,
      ...(uploadStatus === 'Schedule' && { timeData, dateScheduled, timePeriod })
    };
    
    console.log('Upload data:', uploadData);
    
    fileList.forEach(file => {
      if (!file.url && uploadProgress[file.uid] < 100) {
        simulateUpload(file.uid);
      }
    });
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
        <Button 
          onClick={handleSubmit}
          className="bg-[#b584e6] hover:bg-[#8a5ac4] border-none text-white"
          size="large"
        >
          {uploadStatus}
        </Button>
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
        <div className="w-full mb-8">
          <div className="space-y-4">
            {fileList.map(file => (
              <div key={file.uid} className="bg-[#171717] p-4 rounded-lg">
                <div className="flex items-start mb-3">
                  {file.type?.startsWith('image/') && (
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <img 
                        src={file.thumbUrl || URL.createObjectURL(file.originFileObj)} 
                        alt={file.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                        <div className='flex items-center justify-between w-[865px]'>
                          <p className="text-sm text-gray-400">
                            {Math.round(file.size / 1024)} KB • 
                          </p>
                          <p>{uploadProgress[file.uid] || 0}%</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFile(file.uid)}
                        className="text-gray-400 ml-[-30px] hover:text-white"
                      >
                        <FaTimes color='red' />
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
      <div className="w-full bg-[#171717] p-5 rounded-xl">
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