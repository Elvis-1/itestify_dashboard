import React, { useRef, useState } from "react";
import {
  TbRewindBackward5,
  TbRewindForward5,
} from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoVolumeHigh } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";
import "../App.css";

function VideoPlayer({ children }) {
  const videoRef = useRef(null);
  const [playback, setPlayback] = useState('1');
  const [showPlayback, setShowPlayback] = useState(false);
  const [showQualitySettings, setShowQualitySettings] = useState(false)
  const progressBarRef = useRef(null);
  const progressAreaRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    const progress = (current / total) * 100;
    setCurrentTime(current);
    setDuration(total);
    progressBarRef.current.style.width = `${progress}%`;
  };

  const handleProgressClick = (e) => {
    const progressWidth = progressAreaRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / progressWidth) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const changeVideoQuality = (url) => {
    const currentTime = videoRef.current.currentTime;
    videoRef.current.src = url;
    videoRef.current.load();
    videoRef.current.currentTime = currentTime;
    if (isPlaying) videoRef.current.play();
    setShowQualitySettings(false);
  };

   // Handle Fullscreen
   const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
   }

   const handlePlaybackChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlayback(speed);
   };

  return (
    <div id="video_player">
      <div id="main_video">
        {React.cloneElement(children, {
          ref: videoRef,
          onTimeUpdate: updateProgress,
          onLoadedMetadata: updateProgress,
        })}
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
                onClick={() =>
                  (videoRef.current.currentTime -= 5)
                }
              />
            </span>
            <span className='icon speed cursor-pointer' onClick={() => setShowPlayback(!showPlayback)}>{playback}x</span>
            <span className="icon">
              <TbRewindForward5
                size={15}
                className="fast-forward"
                onClick={() =>
                  (videoRef.current.currentTime += 5)
                }
              />
            </span>
            <div className="timer">
              <span className="current">
                {new Date(currentTime * 1000)
                  .toISOString()
                  .substr(14, 5)}
              </span>{" "}
              /{" "}
              <span className="duration">
                {new Date(duration * 1000)
                  .toISOString()
                  .substr(14, 5)}
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
                defaultValue="50"
                className="volume_range"
                onChange={(e) =>
                  (videoRef.current.volume =
                    e.target.value / 100)
                }
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
