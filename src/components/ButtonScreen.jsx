import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function ButtonScreen() {
  const [isPlaying, setIsPlaying] = useState(false); // Tracks if a video is playing
  const [playingVideo, setPlayingVideo] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const timeoutRef = useRef(null); // Ref to track the timeout

  const videoFiles = [1, 2, 3, 4, 5];

  // Function to reset the inactivity timer
  const resetInactivityTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log('No activity for 15 seconds, navigating to /');
      navigate('/');
    }, 15000);
  };

  // Handle button click
  const handleButtonClick = (num) => {
    console.log(`Button ${num} clicked`);

    // Stop the currently playing video (if any)
    if (videoRef.current) {
      console.log('Stopping currently playing video');
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set the new video to play
    setPlayingVideo(num);
    setIsPlaying(true);

    // Send signal to play the corresponding video
    console.log(`Emitting play-video event for video number: ${num}`);
    socket.emit('play-video', num);
  };

  // Handle back button click
  const handleBackButtonClick = () => {
    console.log('Back button clicked');

    // Stop the video and reset states
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPlayingVideo(null);

    // Reset the inactivity timer
    resetInactivityTimer();

    // Emit stop-video event
    console.log('Emitting stop-video event');
    socket.emit('stop-video');
  };
  useEffect(() => {
    if (isPlaying) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
  
    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPlaying]);
  // Use useEffect to set the onended event handler after the video element is rendered
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onended = () => {
        console.log('Video ended');
        setIsPlaying(false);
        setPlayingVideo(null);

        // Start the 15-second inactivity timer after the video ends
        console.log('Starting 15-second inactivity timer after video ends');
        resetInactivityTimer();
      };
    }
  }, [playingVideo]);

  // Set up global event listeners for user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (!isPlaying) {
        console.log('User activity detected, resetting inactivity timer');
        resetInactivityTimer();
      }
    };

    // Listen for mouse and keyboard events
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // Initialize the inactivity timer if no video is playing
    if (!isPlaying) {
      resetInactivityTimer();
    }

    // Cleanup event listeners and timers on unmount
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying]); // Re-run effect when `isPlaying` changes

  return (
    <div
      className="min-h-screen p-4 relative bg-gray-100 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/images/background2.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {isPlaying ? (
        // Video player section
        <div className="relative w-full">
          <video
            ref={videoRef}
            src={`/videos2/${playingVideo}.mp4`}
            autoPlay
            // muted
            controls
            className="w-full h-auto max-h-screen"
          />
          {/* Back button over the video */}
          <button
            onClick={handleBackButtonClick}
            className="absolute top-4 right-4 bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-colors"
          >
            Back
          </button>
        </div>
      ) : (
        // Buttons section
        <div className="w-full">
          {/* First Row at 40% from the top */}
          <div className="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="flex justify-between mx-48 gap-x-40">
              {videoFiles.slice(0, 2).map((num, index) => (
                <button
                  key={num}
                  disabled={isPlaying}
                  onClick={() => handleButtonClick(num)}
                  className={`rounded-lg p-4 flex items-center justify-center text-4xl w-[500px] h-[94px] transition-colors`}
                  style={{
                    backgroundImage: `url('/images/${index === 0 ? 'about_us.png' : 'our_product.png'}')`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* {num} */}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute top-[59%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="flex justify-between mx-48 gap-x-40">
              {videoFiles.slice(2, 4).map((num, index) => (
                <button
                  key={num}
                  disabled={isPlaying}
                  onClick={() => handleButtonClick(num)}
                  className="rounded-lg p-4 flex items-center justify-center text-4xl w-[500px] h-[94px] transition-colors hover:bg-green-600 disabled:bg-gray-400 relative overflow-hidden"
                  style={{
                    backgroundImage: `url('/images/${index === 0 ? 'achievements.png' : 'our_future.png'}')`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* {num} */}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="flex justify-center mx-48 gap-x-40">
              <button
                key={videoFiles[4]}
                disabled={isPlaying}
                onClick={() => handleButtonClick(videoFiles[4])}
                className={`border rounded-lg p-4 flex items-center justify-center text-4xl w-[500px] h-[94px] transition-colors`}
                style={{
                  backgroundImage: "url('/images/more_info.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* {videoFiles[4]} */}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Back button (outside video player) */}
      {!isPlaying && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => navigate('/')}
            className="border border-red-500 rounded-lg px-6 py-2 text-red-500 hover:bg-red-50 transition-colors"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}