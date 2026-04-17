import React, { useEffect, useState } from "react";
import "./VideoPopup.css";
import videoFile from "../../assets/videos/schemes.mp4";

function VideoPopup() {
  const [show, setShow] = useState(true);

  // auto show on load
  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={() => setShow(false)}>
      
      <div className="popup-video-box" onClick={(e) => e.stopPropagation()}>
        
        <video
          autoPlay
          controls
          className="popup-video"
        >
          <source src={videoFile} type="video/mp4" />
        </video>

        <button className="close-btn" onClick={() => setShow(false)}>
          ✖
        </button>

      </div>

    </div>
  );
}

export default VideoPopup;