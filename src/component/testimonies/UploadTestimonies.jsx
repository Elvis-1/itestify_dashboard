import React, { useState, useRef, useEffect } from 'react';
import { Upload, message, DatePicker, TimePicker } from 'antd';
import { FaPlay, FaTimes, FaCloudUploadAlt, FaInfoCircle } from "react-icons/fa";
import { FaCaretDown, FaCaretUp, FaCheck } from "react-icons/fa6";
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';

dayjs.extend(utc);

const { Dragger } = Upload;

function UploadTestimonies() {
  // Form state
  const [uploadStatus, setUploadStatus] = useState('drafts');
  const [uploadCategory, setUploadCategory] = useState('Select Category');
  const [uploadDropDown, setUploadDropDown] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [autoGenerate, setAutoGenerate] = useState('');
  
  // Videos state
  const [videos, setVideos] = useState([
    { 
      id: 1, 
      title: '', 
      source: '', 
      file: null, 
      thumbnail: {
        file: null,
        url: null
      },
      uploadType: '',
      error: null,
      progress: 0,
      isUploading: false,
      isGeneratingThumbnail: false
    }
  ]);
  
  // Upload state
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState('Single Video Upload');
  const [selectUploadMode, setSelectUploadMode] = useState(false);
  const abortControllers = useRef({});

 

  // Handle status change
  const handleStatusChange = (e) => {
    setUploadStatus(e.target.value);
    if (e.target.value !== 'schedule_for_later') {
      setScheduleDate(null);
      setScheduleTime(null);
    }
  };

  // File handlers
  const beforeUpload = (id) => (file) => {
    if (file.size > 200 * 1024 * 1024) {
      message.error('File must be smaller than 200MB');
      return false;
    }
  
    const allowedTypes = ['video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Only MP4/MOV videos are allowed');
      return false;
    }
  
    updateVideoField(id, 'file', file);
    return false;
  };

  const beforeThumbnailUpload = (id) => (file) => {
    if (file.size > 5 * 1024 * 1024) {
      message.error('Thumbnail must be smaller than 5MB');
      return false;
    }
    const thumbnailUrl = URL.createObjectURL(file);
    updateVideoField(id, 'thumbnail', {
      file,
      url: thumbnailUrl
    });
    updateVideoField(id, 'uploadType', 'Custom Upload');
    return false;
  };

  const removeFile = (id) => {
    updateVideoField(id, 'file', null);
    updateVideoField(id, 'progress', 0);
    updateVideoField(id, 'error', null);
  };

  const removeThumbnail = (id) => {
    setVideos(videos.map(video => {
      if (video.id === id && video.thumbnail?.url) {
        URL.revokeObjectURL(video.thumbnail.url);
        return { 
          ...video, 
          thumbnail: { file: null, url: null },
          uploadType: ''
        };
      }
      return video;
    }));
  };

  const updateVideoField = (id, field, value) => {
  setVideos(prev =>
    prev.map(video =>
      video.id === id
        ? { ...video, [field]: value }
        : video
    )
  );
};

  const generateAutoThumbnail = async (id) => {
    const videoObj = videos.find(v => v.id === id);
    if (!videoObj?.file) {
      message.error('Please upload a video first');
      return;
    }

    updateVideoField(id, 'isGeneratingThumbnail', true);
    updateVideoField(id, 'error', null);

    // Create video element in memory
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const videoUrl = URL.createObjectURL(videoObj.file);

    try {
      // Set up video element
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;

      // Wait for video metadata to load
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          if (video.readyState >= 2) resolve();
        };
        video.onerror = () => reject(new Error('Video loading failed'));
        video.load();
      });

      // Seek to a good frame (2 seconds or 10% of duration)
      const seekTime = Math.min(2, video.duration * 0.1);
      video.currentTime = seekTime;

      // Wait for seek to complete
      await new Promise((resolve, reject) => {
        const seekTimeout = setTimeout(() => {
          reject(new Error('Seek timed out'));
        }, 3000);

        video.onseeked = () => {
          clearTimeout(seekTimeout);
          resolve();
        };
        video.onerror = () => {
          clearTimeout(seekTimeout);
          reject(new Error('Seek failed'));
        };
      });

      // Set canvas dimensions and draw frame
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create thumbnail from canvas'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.8 // quality
        );
      });

      // Create thumbnail file and URL
      const thumbnailFile = new File([blob], `thumbnail_${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });
      const thumbnailUrl = URL.createObjectURL(thumbnailFile);
      setAutoGenerate(thumbnailUrl);
      // Update state
      updateVideoField(id, 'thumbnail', {
        file: thumbnailFile,
        url: thumbnailUrl
      });
      updateVideoField(id, 'uploadType', 'Auto Generate');
      message.success('Thumbnail generated successfully!');

    } catch (error) {
      console.error('Thumbnail generation error:', error);
      message.error('Failed to generate thumbnail. Please try custom upload.');
      updateVideoField(id, 'error', 'Thumbnail generation failed');
      
      // Try fallback to first frame
      try {
        await generateFirstFrameFallback(id);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      URL.revokeObjectURL(videoUrl);
      updateVideoField(id, 'isGeneratingThumbnail', false);
    }
  };

  const generateFirstFrameFallback = async (id) => {
    const videoObj = videos.find(v => v.id === id);
    if (!videoObj?.file) return;

    const video = document.createElement('video');
    const videoUrl = URL.createObjectURL(videoObj.file);
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;

    try {
      // Wait for first frame
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = reject;
        video.load();
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.7);
      });

      if (blob) {
        const thumbnailFile = new File([blob], `fallback_thumb.jpg`, {
          type: 'image/jpeg',
        });
        const thumbnailUrl = URL.createObjectURL(thumbnailFile);
        updateVideoField(id, 'thumbnail', {
          file: thumbnailFile,
          url: thumbnailUrl
        });
        updateVideoField(id, 'uploadType', 'Auto Generate');
        message.warning('Used first frame as thumbnail');
      }
    } finally {
      URL.revokeObjectURL(videoUrl);
    }
  };

  // Upload control
  const cancelUpload = (id) => {
    if (abortControllers.current[id]) {
      abortControllers.current[id].abort();
      updateVideoField(id, 'isUploading', false);
      updateVideoField(id, 'progress', 0);
      updateVideoField(id, 'error', 'Upload cancelled by user');
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Authentication required. Please login again.');
      return;
    }

    // Validate all videos first
    for (const video of videos) {
      if (!video.title?.trim()) {
        message.error(`Title is required for Video ${video.id}`);
        return;
      }
      if (!video.source?.trim()) {
        message.error(`Source is required for Video ${video.id}`);
        return;
      }
      if (uploadCategory === 'Select Category') {
        message.error('Please select a category');
        return;
      }
      if (!video.file) {
        message.error(`Video file is required for Video ${video.id}`);
        return;
      }
      if (video.file.size > 200 * 1024 * 1024) {
        message.error(`Video ${video.id} exceeds 200MB limit`);
        return;
      }
    }

    // Schedule validation
    let scheduledDateTime;
    if (uploadStatus === 'schedule_for_later') {
      if (!scheduleDate || !scheduleTime) {
        message.error('Please select both date and time for scheduling');
        return;
      }
      
      scheduledDateTime = dayjs(scheduleDate)
        .hour(scheduleTime.hour())
        .minute(scheduleTime.minute())
        .second(0)
        .millisecond(0);

      if (scheduledDateTime.isBefore(dayjs())) {
        message.error('Scheduled time must be in the future');
        return;
      }
    }

    setLoading(true);

    try {
      // Process videos sequentially
      for (const video of videos) {
        try {
          updateVideoField(video.id, 'isUploading', true);
          updateVideoField(video.id, 'error', null);
          
          const formData = new FormData();
          formData.append('title', video.title.trim());
          formData.append('source', video.source.trim());
          formData.append('category', uploadCategory);
          formData.append('upload_status', uploadStatus);
          formData.append('video_file', video.file);
          formData.append('thumbnail', video.thumbnail.file || '');
          
          console.log(autoGenerate, 'thumbnail file');
          if (video.thumbnail?.file) {
            formData.append('thumbnail', video.thumbnail.file);
          }

          if (uploadStatus === 'schedule_for_later') {
            formData.append('scheduled_datetime', scheduledDateTime.toISOString());
          }

          console.log('Uploading video:', video.thumbnail.file, video.file);
          const controller = new AbortController();
          abortControllers.current[video.id] = controller;
          
          const timeoutId = setTimeout(() => {
            controller.abort();
            throw new Error('Upload timed out after 2 minutes');
          }, 120000);

          const response = await axios.post(
            'https://itestify-backend-38u1.onrender.com/testimonies/videos/create_video/',
            formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
              signal: controller.signal,
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const progress = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  updateVideoField(video.id, 'progress', progress);
                }
              },
            }
          );

          clearTimeout(timeoutId);
          delete abortControllers.current[video.id];

          if (response.data?.success) {
            message.success(`Video ${video.id} uploaded successfully!`);
          } else {
            throw new Error(response.data?.message || 'Unexpected response format');
          }
        } catch (error) {
          console.error(`Upload failed for Video ${video.id}:`, error);
          const errorMsg = error.response?.data?.message || 
                          error.message || 
                          'Upload failed';
          
          updateVideoField(video.id, 'error', errorMsg);
          message.error(`Video ${video.id} failed: ${errorMsg}`);
        } finally {
          updateVideoField(video.id, 'isUploading', false);
        }

        // Small delay between uploads to avoid server overload
        if (video.id !== videos[videos.length - 1].id) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Check if all succeeded
      const allSuccess = videos.every(v => !v.error);
      if (allSuccess) {
        resetForm();
      }
    } catch (error) {
      console.error("Unexpected error during upload process:", error);
      message.error('An unexpected error occurred during the upload process');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Clean up any thumbnail URLs
    const cleanedVideos = videos.map(video => {
      if (video.thumbnail?.url) {
        URL.revokeObjectURL(video.thumbnail.url);
      }
      return {
        id: video.id,
        title: '',
        source: '',
        file: null,
        thumbnail: {
          file: null,
          url: null
        },
        uploadType: '',
        error: null,
        progress: 0,
        isUploading: false,
        isGeneratingThumbnail: false
      };
    });

    setVideos(cleanedVideos.length > 1 ? [cleanedVideos[0]] : cleanedVideos);
    setUploadCategory('Select Category');
    setUploadStatus('drafts');
    setScheduleDate(null);
    setScheduleTime(null);
  };

  const addNewVideo = () => {
    if (videos.length >= 5) {
      message.warning('Maximum of 5 videos allowed');
      return;
    }

    const newId = videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1;
    
    setVideos([...videos, {
      id: newId,
      title: '',
      source: '',
      file: null,
      thumbnail: {
        file: null,
        url: null
      },
      uploadType: '',
      error: null,
      progress: 0,
      isUploading: false,
      isGeneratingThumbnail: false
    }]);
  };

  const removeVideo = (id) => {
    if (videos.length <= 1) {
      message.warning('You must have at least one video');
      return;
    }
    
    // Cancel upload if in progress
    if (abortControllers.current[id]) {
      abortControllers.current[id].abort();
      delete abortControllers.current[id];
    }
    
    // Clean up thumbnail URL if exists
    const videoToRemove = videos.find(v => v.id === id);
    if (videoToRemove?.thumbnail?.url) {
      URL.revokeObjectURL(videoToRemove.thumbnail.url);
    }
    
    setVideos(videos.filter(video => video.id !== id));
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className='w-[93%] mx-auto p-5 mt-[-10px] flex items-center justify-between'>
        <h2 className="text-xl font-semibold">Upload Video Testimonies</h2>

        <div>
          {uploadMode === 'Multiple Upload Mode' &&
          <button 
            className='border border-[#9966CC] text-[13px] p-2 mr-3 text-[#9966CC] rounded-lg'
            onClick={addNewVideo}
            disabled={videos.length >= 5}
          >
            + Add New Video
          </button>}
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
                Uploading
              </span>
            ) : uploadStatus === 'drafts' ? 'Save Draft' : uploadStatus === 'upload_now' ? 'Upload Now' : 'Schedule'}
          </button>
        </div>
      </div>

      <div className='mx-[55px]'>
        <h3 className='text-[13px] mb-2'>Upload Mode</h3>
        <div onClick={() => setSelectUploadMode(!selectUploadMode)}
        className='flex items-center gap-3 bg-[#171717] p-2 w-[180px] mb-3 rounded cursor-pointer'>
          <p className='text-[13px]'>{uploadMode}</p>
          <div>
            <p>
              {selectUploadMode ? <FaCaretUp/> : <FaCaretDown/>}
            </p>
          </div>
        </div>
        {selectUploadMode && 
        <div className='bg-[#171717] w-[200px] rounded-lg mb-3 text-[14px] px-2 py-2'>
          <div className='flex items-center gap-4'>
            <input type="button"
            className='mb-2 cursor-pointer py-2'
            onClick={(e) => {
                 setUploadMode(e.target.value);
                 setSelectUploadMode(false);
                 if (videos.length > 1) {
                   setVideos([videos[0]]);
                 }
            }}
            value='Single Upload Mode'/>
            {uploadMode === 'Single Upload Mode' && <FaCheck className="text-white mt-[-10px]" />}
          </div>

          <div className='flex items-center gap-4'>
            <input type="button"
            className='cursor-pointer'
            onClick={(e) => {
                 setUploadMode(e.target.value);
                 setSelectUploadMode(false);
            }}
            value='Multiple Upload Mode'/>
            {uploadMode === 'Multiple Upload Mode' && <FaCheck className="text-white" />}
          </div>
        </div>}
      </div>

      <div>
        {/* Render each video form */}
        {videos.map((video, index) => (
          <div key={`video-${video.id}`} className='bg-[#171717] w-[90%] mb-6 mx-auto rounded-xl p-4'>
            {/* Video header with remove button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Video {index + 1}</h3>
              {videos.length > 1 && (
                <button 
                  onClick={() => removeVideo(video.id)}
                  className="text-red-500 text-[15px] hover:text-red-400 p-1"
                  title="Remove this video"
                  disabled={video.isUploading || video.isGeneratingThumbnail}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            {video.error && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4 flex items-start">
                <FaInfoCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-red-300 font-medium">Upload Error</p>
                  <p className="text-sm text-red-200">{video.error}</p>
                </div>
              </div>
            )}
            
            <div className='flex flex-col lg:flex-row items-start gap-6'>
              {/* Left Panel - Form */}
              <div className='w-full lg:w-[450px] rounded-xl bg-[#222222] p-4'>
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title*</label>
                  <input
                    className="w-full p-2 rounded bg-[#292929] text-sm border-none outline-none text-white placeholder-gray-400 focus:ring-1 focus:ring-[#9966CC] transition-all"
                    type="text"
                    placeholder="Enter Video Title"
                    value={video.title}
                    onChange={(e) => updateVideoField(video.id, 'title', e.target.value)}
                    disabled={video.isUploading || video.isGeneratingThumbnail}
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
                    value={video.source}
                    onChange={(e) => updateVideoField(video.id, 'source', e.target.value)}
                    disabled={video.isUploading || video.isGeneratingThumbnail}
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category*</label>
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => !(video.isUploading || video.isGeneratingThumbnail) && setUploadDropDown(!uploadDropDown)}
                  >
                    <div className={`flex items-center justify-between bg-[#292929] p-2 rounded hover:bg-[#333] transition-colors ${(video.isUploading || video.isGeneratingThumbnail) ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      <span className={uploadCategory === 'Select Category' ? 'text-gray-400' : 'text-white'}>
                        {uploadCategory}
                      </span>
                      {uploadDropDown ? 
                        <FaCaretUp className="text-gray-400 transition-transform" /> : 
                        <FaCaretDown className="text-gray-400 transition-transform" />
                      }
                    </div>
                    
                    {uploadDropDown && !(video.isUploading || video.isGeneratingThumbnail) && (
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
                {uploadStatus === 'schedule_for_later' && index === 0 && (
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
                        disabled={video.isUploading || video.isGeneratingThumbnail}
                      />
                      <TimePicker
                        className="w-full bg-[#292929] border-none text-white"
                        placeholder="Select time"
                        value={scheduleTime}
                        onChange={setScheduleTime}
                        format="HH:mm"
                        disabled={video.isUploading || video.isGeneratingThumbnail}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Upload Area */}
              <div className='w-full lg:w-[450px] rounded-2xl bg-[#222222] p-4 flex flex-col'>
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
                      padding: '20px',
                      opacity: (video.isUploading || video.isGeneratingThumbnail) ? 0.7 : 1,
                      pointerEvents: (video.isUploading || video.isGeneratingThumbnail) ? 'none' : 'auto'
                    }}
                    beforeUpload={beforeUpload(video.id)}
                    accept="video/mp4,video/quicktime"
                    maxCount={1}
                    showUploadList={false}
                    disabled={video.isUploading || video.isGeneratingThumbnail}
                  >
                    <div className='w-12 h-12 rounded-xl mb-3 flex items-center justify-center bg-[#313131] mx-auto'>
                      <FaPlay size={20} className="text-[#9966CC] border-2 border-[#9966CC] p-1" />
                    </div>
                    <p className="text-center mb-1 text-white">
                      Drag and drop or <span className='text-[#9966CC]'>choose file</span> here to upload
                    </p>
                    <p className="text-sm text-gray-400">MP4/MOV, Max size (200MB)</p>
                  </Dragger>
                  
                  {/* Selected File */}
                  {video.file && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between bg-[#292929] p-2 rounded-lg">
                        <span className="text-xs text-white truncate max-w-[80%]">{video.file.name}</span>
                        <button 
                          onClick={() => removeFile(video.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          disabled={video.isUploading || video.isGeneratingThumbnail}
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      {/* Upload Progress */}
                      {(video.progress > 0 || video.isUploading) && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">Upload progress</span>
                            <span className="text-xs font-medium text-white">{video.progress}%</span>
                          </div>
                          <div className="w-full bg-[#292929] rounded-full h-2">
                            <div 
                              className="bg-[#9966CC] h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${video.progress}%` }}
                            />
                          </div>
                          
                          {video.isUploading && video.progress < 100 && (
                            <button 
                              onClick={() => cancelUpload(video.id)}
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
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Custom Upload Option */}
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border border-[#9966CC] mr-2 flex items-center justify-center transition-colors
                        ${video.uploadType === 'Custom Upload' ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                        {video.uploadType === 'Custom Upload' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <input 
                        type="radio"
                        name={`thumbnail-${video.id}`}
                        id={`custom-${video.id}`}
                        className="hidden"
                        checked={video.uploadType === 'Custom Upload'}
                        onChange={() => updateVideoField(video.id, 'uploadType', 'Custom Upload')}
                        disabled={video.isUploading || video.isGeneratingThumbnail}
                      />
                      <label 
                        htmlFor={`custom-${video.id}`} 
                        className={`text-sm cursor-pointer select-none ${(video.isUploading || video.isGeneratingThumbnail) ? 'opacity-70' : ''}`}
                      >
                        Custom Upload
                      </label>
                    </div>

                    {/* Auto Generate Option */}
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border border-[#9966CC] mr-2 flex items-center justify-center transition-colors
                        ${video.uploadType === 'Auto Generate' ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                        {video.uploadType === 'Auto Generate' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <input 
                        type="radio"
                        name={`thumbnail-${video.id}`}
                        id={`auto-${video.id}`}
                        className="hidden"
                        checked={video.uploadType === 'Auto Generate'}
                        onChange={() => {
                          updateVideoField(video.id, 'uploadType', 'Auto Generate');
                          generateAutoThumbnail(video.id);
                        }}
                        disabled={video.isUploading || video.isGeneratingThumbnail || !video.file}
                      />
                      <label 
                        htmlFor={`auto-${video.id}`} 
                        className={`text-sm cursor-pointer select-none ${(video.isUploading || video.isGeneratingThumbnail || !video.file) ? 'opacity-70' : ''}`}
                      >
                        Auto Generate
                        {video.isGeneratingThumbnail && (
                          <span className="ml-2 inline-block">
                            <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                      </label>
                      {video.thumbnail?.url && (
                        <img 
                          src={video.thumbnail.url} 
                          alt="Preview" 
                          className="ml-2 max-h-20 w-auto rounded border border-gray-600"
                        />
                      )}
                    </div>
                  </div>

                  {video.uploadType === 'Custom Upload' && (
                    <div className="mt-4">
                      <Dragger 
                        className="thumbnail-uploader hover:border-[#9966CC] transition-colors"
                        style={{
                          backgroundColor: '#171717',
                          border: '1px dashed #444',
                          borderRadius: '8px',
                          padding: '12px',
                          color: 'white',
                          opacity: (video.isUploading || video.isGeneratingThumbnail) ? 0.7 : 1,
                          pointerEvents: (video.isUploading || video.isGeneratingThumbnail) ? 'none' : 'auto'
                        }}
                        beforeUpload={beforeThumbnailUpload(video.id)}
                        accept="image/*"
                        maxCount={1}
                        showUploadList={false}
                        disabled={video.isUploading || video.isGeneratingThumbnail}
                      >
                        <p className="text-center mb-1 text-white">
                          Drag and drop or <span className='text-[#9966CC]'>choose file</span> here to upload
                        </p>
                        <p className="text-center text-xs text-gray-400 mt-1">Max size (5MB)</p>
                      </Dragger>
                      
                      {video.thumbnail?.url && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between bg-[#292929] p-2 rounded-lg">
                            <span className="text-xs text-white truncate max-w-[80%]">{video.thumbnail.file?.name || 'thumbnail.jpg'}</span>
                            <button 
                              onClick={() => removeThumbnail(video.id)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                              disabled={video.isUploading || video.isGeneratingThumbnail}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Status - Shared for all videos */}
      <div className="mt-6 mx-[60px] bg-[#171717] rounded-lg mb-3 p-3">
        <label className="block text-sm font-medium mb-3">Upload Status*</label>
        <div className="flex items-center gap-6">
          {['drafts', 'upload_now', 'schedule_for_later'].map((status) => (
            <div key={status} className="flex items-center gap-2">
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
                disabled={loading}
              />
              <label 
                htmlFor={status.toLowerCase()} 
                className={`text-sm cursor-pointer select-none ${loading ? 'opacity-70' : ''}`}
              >
                {status === 'upload_now' ? 'Upload Now' : 
                status === 'schedule_for_later' ? 'Schedule For Later' : 'Save Draft'}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UploadTestimonies;