import { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';

const VideoCarousel = () => {
  // video reference variables
  // useRef hook allows you to persist values between renders.
  // can be used to store a mutable value that does not cause a re-render when updated.
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  // create a state for the video
  // useState hook allows you to track the state in a function component
  // data or properties that need to be tracking in an application.
  const [video, setVideo] = useState({
    // properties for the video
    isEnd: false,
    startPlay: false, // for each video, we need to figure out when to start play
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  })

  const [loadedData, setLoadedData] = useState([])

  // destructure the setVideo state data to make it easier to work with.
  // can now use these without typing video._______
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video

  // Use GSAP to update animations when the video changes
  useGSAP(() => {
    // animate gsap to play when the video is in view
    gsap.to('#video', {
        scrollTrigger: {
            trigger: '#video',
            toggleActions: 'restart none none none',
        },
        onComplete: () => {
            setVideo((pre) => ({
                ...pre,
                startPlay: true,
                isPlaying: true,
            }))
        }
    })
  }, [isEnd, videoId])


  // Deals with the playing of the video
  // can be retriggered when the startPlay, videoId, isPlaying, loadedData changes.
  useEffect(() => {
    if(loadedData.length > 3) {
        if(!isPlaying) {
            videoRef.current[videoId].pause();
        } else {
            startPlay && videoRef.current[videoId].play();
        }
    }
  }, [startPlay, videoId, isPlaying, loadedData])


  //This function will accept the index / event passed into it
  // call the setLoadedData function. Take all previously loaded data and automatically return an array with the new event

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]); 
  



  // Create a use Effect to start playing the videos
  // allows you to perform side effects in your components
  // i.e., fetching data, directly updating the DOM, and timers, etc.
  // dependency array: use the effect whenever the videoId, startPlay changes   
  useEffect(() => {
    // figure out where are we in the video play journey
    const currentProgress = 0;

    // get the span element of the currently playing video
    let span = videoSpanRef.current;

    // if we have the span of the videoId -> start animating
    if(span[videoId]) {
        // animate the progress of the video
        let anim = gsap.to(span[videoId], {
            // onUpdate defines what happens when the video updates
            onUpdate: () => {

            },

            // what happens if the animation is complete
            onComplete: () => {

            },
        })
    }
  }, [videoId, startPlay])

  // a function to define the handling of the onClick
  // use a switch whenever there are multiple cases.
  const handleProcess = (type, i) => {
    switch (type) {
        // Case 1:
        // if the case is videoEnd, set the video isEnd state to true
        // increment the video ID + 1
        case 'video-end':
            setVideo((pre) => ({...pre, isEnd: true, videoId: i + 1}))
            break;
    
        // Case 2:
        // if on the last video, but not yet the end.
        // spread the previous video and set the isLastVideo to true
        case 'video-last':
            setVideo((pre) => ({ ...pre, isLastVideo: true}))
            break;

        // Case 3:
        // Duplicate set video & isLastVideo = false, reset the video ID to 0.
        case 'video-reset':
            setVideo((pre) => ({...pre, isLastVideo: false, videoId: 0}))
            break;
        
        // Case 4: Play
        // Set is playing to the opposite of previous.isplaying
        case 'play':
            setVideo((pre) => ({...pre, isPlaying: !pre.isPlaying}))
            break;

        default:
            return video;
    }
  }


  return (
    <>
        <div className='flex items-center'>
            {/* map over all of our highlight slides. For each one, we get a list & index*/}
            {hightlightsSlides.map((list, i) => (
                <div key={list.id} id="slider" className='sm:pr-20 pr-10'>
                    <div className='video-carousel_container'>
                        <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                            <video
                              id='video'
                              playsInline={true}
                              preload='auto'
                              muted
                              // finding a specific index in the videoRefs array and setting to the current video element
                              ref={(el) => (videoRef.current[i] = el)}

                              // spread all the information about the video, but set the is palying to true.   
                              onPlay={() => {
                                setVideo((prevVideo) => ({
                                    ...prevVideo, isPlaying: true
                                }))
                              }}
                              onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                            >
                                <source src={list.video} type='video/mp4'/>
                            </video>
                        </div>
                        <div className='absolute top-12 left-[5%] z-10'>
                            {list.textLists.map((text) => (
                                <p key={text} className='md:text-2xl text-xl font-medium'>{text}</p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="relative flex-center mt-10">
            <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
                {/* get each video, and then get the index. For each video ref, return a span element
                that span element will have a key and a ref. */}
                {videoRef.current.map((_, i) => (
                    <span
                        key={i}
                        ref={(el) => (videoDivRef.current[i] = el)} 
                        className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
                    >
                        <span className='absolute h-full w-full rounded-full' ref={(el) => (videoSpanRef.current[i] = el)} />
                
                    </span>
                ))}
            </div>
            <button className='control-btn'>
                <img 
                src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} 
                alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'} 
                onClick={isLastVideo
                    ? () => handleProcess('video-reset')
                    : !isPlaying
                        ? () => handleProcess('play')
                        : () => handleProcess('pause')
                }
                />
            </button>
        </div>
    </>
  )
}

export default VideoCarousel