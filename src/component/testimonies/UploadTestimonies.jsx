import React, { useState, useRef, useContext } from 'react';
import { Upload, message, DatePicker, TimePicker } from 'antd';
import { FaPlay, FaTimes, FaCloudUploadAlt, FaInfoCircle } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import axios from 'axios';

import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';

dayjs.extend(utc)

const { Dragger } = Upload;

function UploadTestimonies() {

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
    // File size validation
    if (file.size > 200 * 1024 * 1024) {
      message.error('File must be smaller than 200MB');
      return false;
    }
  
    // File type validation
      const allowedTypes = ['video/mp4', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        message.error('Only MP4/MOV videos are allowed');
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

  const generateAutoThumbnail = async () => {
    if (!file) {
      message.error('Please upload a video first');
      return;
    }
  
    try {
      // Create video element
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Load video
      video.src = URL.createObjectURL(file);
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
  
      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = () => reject(new Error('Video loading failed'));
        video.load();
      });
  
      // Seek to a good frame (2 seconds in)
      await new Promise((resolve, reject) => {
        video.onseeked = resolve;
        video.onerror = reject;
        video.currentTime = Math.min(2, video.duration * 0.05); // Cap at 5% duration
      });
  
      // Draw frame
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Convert to blob with error handling
      const blob = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('Canvas returned null blob');
              message.error('Failed to capture video frame');
              resolve(null);
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.7 // Quality (70%)
        );
      });
  
      if (!blob) {
        throw new Error('Thumbnail generation failed');
      }
  
      // Create thumbnail file
      const thumbnailFile = new File([blob], `thumbnail_${file.name.split('.')[0]}.jpg`, {
        type: 'image/jpeg',
      });
  
      setThumbnail(thumbnailFile);
      message.success('Thumbnail generated successfully!');
      
      // Clean up
      URL.revokeObjectURL(video.src);
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      message.error(`Thumbnail failed: ${error.message}`);
      setThumbnail(null);
      
      // Fallback: Use first frame if seeking failed
      try {
        await generateFirstFrameFallback();
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
  };
  
  // Fallback method
  const generateFirstFrameFallback = async () => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.crossOrigin = 'anonymous';
    
    await new Promise((resolve) => {
      video.onloadeddata = resolve;
      video.load();
    });
  
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.7);
    });
  
    if (blob) {
      const thumbnailFile = new File([blob], `fallback_thumb.jpg`, {
        type: 'image/jpeg',
      });
      setThumbnail(thumbnailFile);
      message.warning('Used first frame as thumbnail');
    }
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
    console.log("[Upload] Starting submission process");
    
    let timeoutId;
    const controller = new AbortController();
  
    try {
      // 1. Authentication Check
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Authentication required. Please login again.');
        return;
      }
  
      // 2. Field Validation
      if (!title?.trim()) {
        message.error('Title is required');
        return;
      }
      if (!source?.trim()) {
        message.error('Source is required');
        return;
      }
      if (uploadCategory === 'Select Category') {
        message.error('Please select a category');
        return;
      }
      if (!file) {
        message.error('Video file is required');
        return;
      }
  
      // Schedule validation - more robust handling
      let scheduledDateTime;
      if (uploadStatus === 'schedule_for_later') {
        if (!scheduleDate || !scheduleTime) {
          message.error('Please select both date and time for scheduling');
          return;
        }
        
        // Combine date and time into a single dayjs object
        scheduledDateTime = dayjs(scheduleDate)
          .hour(scheduleTime.hour())
          .minute(scheduleTime.minute())
          .second(0)
          .millisecond(0);
  
        // Validate scheduled time is in the future
        if (scheduledDateTime.isBefore(dayjs())) {
          message.error('Scheduled time must be in the future');
          return;
        }
      }
  
      // 3. Prepare FormData (matches API requirements exactly)
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('source', source.trim());
      formData.append('category', uploadCategory.toLowerCase()); // Ensure lowercase as per API
      formData.append('upload_status', uploadStatus);
      formData.append('video_file', file);
      
      // Add thumbnail if exists
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }
  
      // Handle scheduling - format exactly as API expects
      if (uploadStatus === 'schedule_for_later') {
        // Format as ISO string with timezone offset
        const isoString = scheduledDateTime.toISOString();
        formData.append('scheduled_datetime', isoString);
        
        console.log('Scheduling video for:', isoString);
      }
  
      // 4. Upload Configuration
      setLoading(true);
      setUploadProgress(0);
      setUploadError(null);
  
      timeoutId = setTimeout(() => {
        controller.abort();
        throw new Error('Upload timed out after 5 minutes');
      }, 5 * 60 * 1000);
  
      // 5. Execute Upload
      const response = await axios.post(
        'https://itestify-backend-nxel.onrender.com/testimonies/videos/create_video/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Let browser set Content-Type with boundary
          },
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );
  
      // 6. Handle Response
      clearTimeout(timeoutId);
      
      if (response.data?.success) {
        const successMessage = uploadStatus === 'schedule_for_later' 
          ? `Video scheduled successfully for ${scheduledDateTime.format('MMMM D, YYYY [at] h:mm A')}`
          : 'Upload successful!';
        
        message.success(successMessage);
        resetForm();
      } else {
        // Handle success cases where response structure differs
        if (response.status === 200 && response.data) {
          const successMessage = uploadStatus === 'schedule_for_later'
            ? 'Video scheduled successfully'
            : 'Upload completed successfully';
          
          message.success(successMessage);
          resetForm();
        } else {
          throw new Error(response.data?.message || 'Unexpected response format');
        }
      }
  
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Special handling for scheduling errors
      if (uploadStatus === 'schedule_for_later') {
        if (error.response?.status === 400 && error.response.data?.scheduled_datetime) {
          message.error(`Invalid schedule time: ${error.response.data.scheduled_datetime[0]}`);
          return;
        }
      }
      
      if (error.message.includes('timed out')) {
        message.error('Upload timed out. Please try again.');
      } 
      else if (error.response) {
        message.error(
          error.response.data?.message || 
          `Server error (${error.response.status})`
        );
      } 
      else {
        message.error(error.message || 'Upload failed. Please try again.');
      }
  
      console.error("Upload error details:", {
        error: error.message,
        response: error.response?.data,
        stack: error.stack
      });
    } 
    finally {
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
                    <p className="text-center mb-1 text-white">
                      Drag and drop or <span className='text-[#9966CC]'>choose file</span> here to upload
                    </p>
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
                  onChange={() => {
                    setUploadType('Auto Generate')
                    generateAutoThumbnail();
                  }}
                />
                <div className='flex items-center gap-3'>
                  <label htmlFor="auto" className="text-sm cursor-pointer select-none">Auto Generate</label>
                  {thumbnail && (
                    <img 
                      src={URL.createObjectURL(thumbnail)} 
                      alt="Preview" 
                      className="max-h-20 w-10  rounded"
                    />
                  )}
                </div>
                
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
                  {['Marriage Restoration', "Breakthrough", "Career", "Financial", 'Healing', 'Deliverance', 'Faith', 'Salvation'].map((category) => (
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
            <div className="flex items-center gap-6"> {/* Removed space-y-3 and kept flex with gap */}
              {['drafts', 'upload_now', 'schedule_for_later'].map((status) => (
                <div key={status} className="flex items-center gap-2"> {/* Added gap between radio and label */}
                  <div className={`w-4 h-4 rounded-full border border-[#9966CC] flex items-center justify-center transition-colors
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