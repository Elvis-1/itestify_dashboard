import React, { useRef, useState, useEffect } from "react";
import { TbRewindBackward5, TbRewindForward5 } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoVolumeHigh } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";
import "../../App.css";

// Utility function to safely format time
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeString = date.toISOString().substr(11, 8);
  return timeString.startsWith("00:") ? timeString.substr(3) : timeString;
};

function VideoPlayer({ children, videoUrl }) {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [playback, setPlayback] = useState(1);
  const [showPlayback, setShowPlayback] = useState(false);
  const [showQualitySettings, setShowQualitySettings] = useState(false);
  const progressBarRef = useRef(null);
  const progressAreaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState(null);

  // Initialize video when component mounts or videoUrl changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setIsLoading(false);
      setError(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Failed to load video");
      console.error("Video error:", video.error);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    // For authenticated video requests
    if (videoUrl) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch(videoUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.blob();
          })
          .then(blob => {
            video.src = URL.createObjectURL(blob);
          })
          .catch(err => {
            console.error("Failed to fetch video:", err);
            // Fallback to direct source if authenticated request fails
            video.src = videoUrl;
          });
      } else {
        video.src = videoUrl;
      }
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Playback failed:", err);
          setError("Playback failed");
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    const total = video.duration || 1; // Fallback to 1 to avoid division by zero
    const progress = (current / total) * 100;
    
    setCurrentTime(current);
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video || !progressAreaRef.current) return;

    const progressWidth = progressAreaRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / progressWidth) * (video.duration || 1);
    video.currentTime = newTime;
  };

  const changeVideoQuality = (url) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    video.src = url;
    video.load();
    video.currentTime = currentTime;
    if (isPlaying) video.play();
    setShowQualitySettings(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Fullscreen error:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false));
    }
  };

  const handlePlaybackChange = (speed) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlayback(speed);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = e.target.value / 100;
    video.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div id="video_player" ref={videoContainerRef}>
      <div id="main_video">
        {React.cloneElement(children, {
          ref: videoRef,
          onTimeUpdate: updateProgress,
          onLoadedMetadata: updateProgress,
          onPlay: () => setIsPlaying(true),
          onPause: () => setIsPlaying(false),
          onEnded: () => setIsPlaying(false),
          onWaiting: () => setIsLoading(true),
          onCanPlay: () => setIsLoading(false),
          playsInline: true
        })}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="spinner"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            {error}
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                videoRef.current?.load();
              }}
              className="ml-2 bg-blue-500 px-2 py-1 rounded"
            >
              Retry
            </button>
          </div>
        )}
      </div>
      <div className="controls">
        <div
          className="progress-area"
          ref={progressAreaRef}
          onClick={handleProgressClick}
        >
          <div className="progress-bar" ref={progressBarRef}></div>
        </div>
        <div className="controls-list">
          <div className="control-left">
            <span className="icon" onClick={togglePlay}>
              {isPlaying ? (
                <FaPause size={13} className="pause" />
              ) : (
                <FaPlay size={13} className="play" />
              )}
            </span>
            <span className="icon">
              <TbRewindBackward5
                size={15}
                className="fast-rewind"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                  }
                }}
              />
            </span>
            <span 
              className='icon speed cursor-pointer' 
              onClick={() => setShowPlayback(!showPlayback)}
            >
              {playback}x
            </span>
            <span className="icon">
              <TbRewindForward5
                size={15}
                className="fast-forward"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(
                      videoRef.current.duration, 
                      videoRef.current.currentTime + 5
                    );
                  }
                }}
              />
            </span>
            <div className="timer">
              <span className="current">
                {formatTime(currentTime)}
              </span> /{" "}
              <span className="duration">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          <div className="control-right">
            <span className="icon">
              <IoVolumeHigh size={16} className="volume" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                className="volume_range"
                onChange={handleVolumeChange}
              />
            </span>
            <span className="icon">
              <IoSettingsOutline
                size={15}
                className="settingsBtn cursor-pointer"
                onClick={() => setShowQualitySettings(!showQualitySettings)}
              />
            </span>
            <span className="icon" onClick={toggleFullscreen}>
              <MdFullscreen size={18} className="fullscreen" />
            </span>
          </div>
        </div>

        {showQualitySettings && (
          <div id="settings">
            <div className="playback w-[100%] opacity-[0.7]">
              <ul className="p-1 rounded-xl w-[100%]">
                <div className="flex items-center justify-between text-[12px] border-b pb-2 pt-1">
                  <li data-quality="1080p">1080p</li>
                  <input type="checkbox" />
                </div>
                <div className="flex items-center justify-between text-[12px] border-b pb-2 pt-2">
                  <li data-quality="720p">720p</li>
                  <input type="checkbox" />
                </div>
                <div className="flex items-center justify-between text-[12px] border-b pb-2 pt-2">
                  <li data-quality="480p">480p</li>
                  <input type="checkbox" />
                </div>
                <div className="flex items-center justify-between text-[12px] pb-2 pt-2">
                  <li data-quality="360p">360p</li>
                  <input type="checkbox" />
                </div>
              </ul>
            </div>
          </div>
        )}

        {showPlayback && (
          <div id="playback_settings">
            <div className="playback opacity-[0.7]">
              <ul className="p-1 rounded-xl">
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                  <div key={speed} className="flex items-center justify-between text-[12px] border-b pb-2 pt-1">
                    <li>{speed}x</li>
                    <input
                      type="checkbox"
                      checked={playback === speed}
                      onChange={() => handlePlaybackChange(speed)}
                    />
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;