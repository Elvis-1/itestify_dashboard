import React, { useState, useRef, useContext } from 'react';
import { Upload, message, DatePicker, TimePicker } from 'antd';
import { FaPlay, FaTimes, FaCloudUploadAlt, FaInfoCircle } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import axios from 'axios';
import { uploadTestContext } from '../../context/UploadTestimonyContext';
import dayjs from 'dayjs';

const { Dragger } = Upload;

function UploadTestimonies() {
  const { uploadTestFn, setUploadTestFn } = useContext(uploadTestContext);

  // Form state
  const [uploadStatus, setUploadStatus] = useState('drafts');
  const [uploadCategory, setUploadCategory] = useState('Select Category');
  const [uploadDropDown, setUploadDropDown] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  
  // File state
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  
  // Upload state
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const abortController = useRef(new AbortController());

  // Handle status change
  const handleStatusChange = (e) => {
    setUploadStatus(e.target.value);
    // Clear schedule fields when changing status
    if (e.target.value !== 'schedule_for_later') {
      setScheduleDate(null);
      setScheduleTime(null);
    }
  };

  // File handlers
  const beforeUpload = (file) => {
    if (file.size > 200 * 1024 * 1024) {
      message.error('File must be smaller than 200MB');
      return false;
    }
    setFile(file);
    return false;
  };

  const beforeThumbnailUpload = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      message.error('Thumbnail must be smaller than 5MB');
      return false;
    }
    setThumbnail(file);
    return false;
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  // Upload control
  const cancelUpload = () => {
    abortController.current.abort();
    setLoading(false);
    setUploadProgress(0);
    setUploadError('Upload cancelled by user');
    abortController.current = new AbortController();
  };

  const handleUploadError = (error) => {
    let errorMessage = 'Failed to upload video';

    if (axios.isCancel(error)) {
      errorMessage = 'Upload cancelled';
    } else if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.statusText || 
                    `Server error (${error.response.status})`;
      
      if (error.response.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response.status === 413) {
        errorMessage = 'File too large. Maximum size is 200MB.';
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Check your connection.';
    } else {
      errorMessage = error.message || 'Upload failed';
    }
    
    setUploadError(errorMessage);
    message.error(errorMessage);
  };

  // Main submit function
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Authentication required. Please login again.');
      return;
    }

    // Validation
    if (!title || !source || !uploadCategory || !file) {
      message.error('Please fill all required fields');
      return;
    }

    if (uploadCategory === 'Select Category') {
      message.error('Please select a category');
      return;
    }

    // Additional validation for scheduled uploads
    if (uploadStatus === 'schedule_for_later' && (!scheduleDate || !scheduleTime)) {
      message.error('Please select both date and time for scheduling');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('source', source);
    formData.append('category', uploadCategory.toLowerCase());
    formData.append('upload_status', uploadStatus);
    formData.append('video_file', file);
    
    // Add scheduled datetime if applicable
    if (uploadStatus === 'schedule_for_later' && scheduleDate && scheduleTime) {
      const combinedDateTime = dayjs(scheduleDate)
        .hour(scheduleTime.hour())
        .minute(scheduleTime.minute())
        .second(0)
        .format('YYYY-MM-DDTHH:mm:ss');
      formData.append('scheduled_datetime', combinedDateTime);
    }
    
    if (thumbnail && uploadType === 'Custom Upload') {
      formData.append('thumbnail', thumbnail);
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadError(null);
      
      const timeoutId = setTimeout(() => {
        abortController.current.abort();
        setUploadError('Upload timed out. Please check your connection.');
        setLoading(false);
      }, 5 * 60 * 1000);

      const response = await axios.post(
        'https://itestify-backend-nxel.onrender.com/testimonies/videos/create_video/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          signal: abortController.current.signal,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
              clearTimeout(timeoutId);
            }
          },
        }
      );

      clearTimeout(timeoutId);
      
      if (response.data.success) {
        message.success(response.data.message || 'Video uploaded successfully!');
        console.log('Uploaded video data:', response.data.data);
        resetForm();
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      handleUploadError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSource('');
    setFile(null);
    setThumbnail(null);
    setUploadCategory('Select Category');
    setUploadStatus('drafts');
    setUploadType('');
    setScheduleDate(null);
    setScheduleTime(null);
    setUploadProgress(0);
    setUploadError(null);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className='w-[90%] mx-auto p-5 mt-4 flex items-center justify-between'>
        <h2 className="text-xl font-semibold">Upload Video Testimonies</h2>
        <button 
          className={`bg-[#9966CC] border-none outline-none p-2 w-[120px] rounded-xl text-white
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#8a5ac4]'}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {uploadProgress}%
            </span>
          ) : uploadStatus === 'drafts' ? 'Save Draft' : uploadStatus === 'upload_now' ? 'Upload Now' : 'Schedule'}
        </button>
      </div>

      {/* Main Content */}
      <div className='flex flex-col lg:flex-row items-start gap-6 w-[90%] mx-auto'>
        {/* Left Panel - Upload Area */}
        <div className='w-full lg:w-[450px] rounded-2xl bg-[#171717] p-4 flex flex-col'>
          {/* Video Upload */}
          <div className='w-full flex-grow min-h-[250px] text-white rounded-xl mb-4'>
            <Dragger 
              className="video-uploader hover:border-[#9966CC] transition-colors"
              style={{
                backgroundColor: '#171717',
                border: '1px dashed #444',
                borderRadius: '12px',
                height: '100%',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
              }}
              beforeUpload={beforeUpload}
              accept="video/mp4"
              maxCount={1}
              showUploadList={false}
              disabled={loading}
            >
              <div className='w-12 h-12 rounded-xl mb-3 flex items-center justify-center bg-[#313131] mx-auto'>
                <FaPlay size={20} className="text-[#9966CC] border-2 border-[#9966CC] p-1" />
              </div>
              <p className="text-center mb-1 text-white">
                Drag and drop or <span className='text-[#9966CC]'>choose file</span> here to upload
              </p>
              <p className="text-sm text-gray-400">MP4, Max size (200MB)</p>
            </Dragger>
            
            {/* Selected File */}
            {file && (
              <div className="mt-3">
                <div className="flex items-center justify-between bg-[#292929] p-2 rounded-lg">
                  <span className="text-xs text-white truncate max-w-[80%]">{file.name}</span>
                  <button 
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-400 transition-colors"
                    disabled={loading}
                  >
                    <FaTimes />
                  </button>
                </div>
                
                {/* Upload Progress */}
                {(uploadProgress > 0 || loading) && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Upload progress</span>
                      <span className="text-xs font-medium text-white">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#292929] rounded-full h-2">
                      <div 
                        className="bg-[#9966CC] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    
                    {loading && uploadProgress < 100 && (
                      <button 
                        onClick={cancelUpload}
                        className="text-xs text-red-400 hover:underline mt-2 transition-colors"
                      >
                        Cancel Upload
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Thumbnail Options */}
          <div className="mt-auto">
            <h3 className='text-sm font-medium mb-3'>Thumbnail</h3>
            
            <div className="space-y-3">
              {/* Custom Upload Option */}
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border border-[#9966CC] mr-2 flex items-center justify-center transition-colors
                  ${uploadType === 'Custom Upload' ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                  {uploadType === 'Custom Upload' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <input 
                  type="radio"
                  name="thumbnail"
                  id="custom"
                  className="hidden"
                  checked={uploadType === 'Custom Upload'}
                  onChange={() => setUploadType('Custom Upload')}
                />
                <label htmlFor="custom" className="text-sm cursor-pointer select-none">Custom Upload</label>
              </div>

              {uploadType === 'Custom Upload' && (
                <div className="ml-6 mb-4">
                  <Dragger 
                    className="thumbnail-uploader hover:border-[#9966CC] transition-colors"
                    style={{
                      backgroundColor: '#171717',
                      border: '1px dashed #444',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'white'
                    }}
                    beforeUpload={beforeThumbnailUpload}
                    accept="image/*"
                    maxCount={1}
                    showUploadList={false}
                    disabled={loading}
                  >
                    <p className="text-center text-sm">Click or drag image to upload thumbnail</p>
                    <p className="text-center text-xs text-gray-400 mt-1">Max size (5MB)</p>
                  </Dragger>
                  
                  {thumbnail && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-[#292929] p-2 rounded-lg">
                        <span className="text-xs text-white truncate max-w-[80%]">{thumbnail.name}</span>
                        <button 
                          onClick={removeThumbnail}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          disabled={loading}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Auto Generate Option */}
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border border-[#9966CC] mr-2 flex items-center justify-center transition-colors
                  ${uploadType === 'Auto Generate' ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                  {uploadType === 'Auto Generate' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                <input 
                  type="radio"
                  name="thumbnail"
                  id="auto"
                  className="hidden"
                  checked={uploadType === 'Auto Generate'}
                  onChange={() => setUploadType('Auto Generate')}
                />
                <label htmlFor="auto" className="text-sm cursor-pointer select-none">Auto Generate</label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className='w-full lg:w-[450px] rounded-xl bg-[#171717] p-4'>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title*</label>
            <input
              className="w-full p-2 rounded bg-[#292929] text-sm border-none outline-none text-white placeholder-gray-400 focus:ring-1 focus:ring-[#9966CC] transition-all"
              type="text"
              placeholder="Enter Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Source */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Source*</label>
            <input
              className="w-full p-2 rounded bg-[#292929] text-sm border-none outline-none text-white placeholder-gray-400 focus:ring-1 focus:ring-[#9966CC] transition-all"
              type="text"
              placeholder="Enter Video Source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category*</label>
            <div 
              className="relative cursor-pointer"
              onClick={() => setUploadDropDown(!uploadDropDown)}
            >
              <div className="flex items-center justify-between bg-[#292929] p-2 rounded hover:bg-[#333] transition-colors">
                <span className={uploadCategory === 'Select Category' ? 'text-gray-400' : 'text-white'}>
                  {uploadCategory}
                </span>
                {uploadDropDown ? 
                  <FaCaretUp className="text-gray-400 transition-transform" /> : 
                  <FaCaretDown className="text-gray-400 transition-transform" />
                }
              </div>
              
              {uploadDropDown && (
                <div className="absolute z-10 w-full mt-1 bg-[#292929] rounded-lg shadow-lg border border-[#444] overflow-hidden">
                  {['Restoration', 'Healing', 'Deliverance', 'Faith', 'Salvation'].map((category) => (
                    <div
                      key={category}
                      className="px-3 py-2 hover:bg-[#9966CC] hover:text-white cursor-pointer transition-colors"
                      onClick={() => {
                        setUploadCategory(category);
                        setUploadDropDown(false);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Date and Time (Conditional) */}
          {uploadStatus === 'schedule_for_later' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Schedule Date & Time*</label>
              <div className="flex gap-3">
                <DatePicker
                  className="w-full bg-[#292929] border-none text-white"
                  placeholder="Select date"
                  value={scheduleDate}
                  onChange={setScheduleDate}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                />
                <TimePicker
                  className="w-full bg-[#292929] border-none text-white"
                  placeholder="Select time"
                  value={scheduleTime}
                  onChange={setScheduleTime}
                  format="HH:mm"
                />
              </div>
            </div>
          )}

          {/* Upload Status */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-3">Upload Status*</label>
            <div className="space-y-3 flex items-center gap-6">
              {['drafts', 'upload_now', 'schedule_for_later'].map((status) => (
                <div key={status} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border border-[#9966CC] mr-2 flex items-center justify-center transition-colors
                    ${uploadStatus === status ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                    {uploadStatus === status && <div className="w-2 h-2 rounded-full bg-white transition-all"></div>}
                  </div>
                  <input
                    type="radio"
                    name="status"
                    id={status.toLowerCase()}
                    className="hidden"
                    value={status}
                    checked={uploadStatus === status}
                    onChange={handleStatusChange}
                  />
                  <label 
                    htmlFor={status.toLowerCase()} 
                    className="text-sm cursor-pointer select-none"
                  >
                    {status === 'upload_now' ? 'Upload Now' : 
                     status === 'schedule_for_later' ? 'Schedule For Later' : 'Save Draft'}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadTestimonies;