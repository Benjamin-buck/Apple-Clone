import { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap';

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


  // Deals with the playing of the video
  // can be retriggered when the startPlay, videoId, isPlaying, loadedData changes.
  useEffect(() => {
    if(loadedData.length < 3) {
        if(!isPlaying) {
            videoRef.current[videoId].pause();
        } else {
            startPlay && videoRef.current[videoId].play();
        }
    }
  }, [startPlay, videoId, isPlaying, loadedData])
  



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
                              onPlay={() => {
                                setVideo((prevVideo) => ({
                                    ...prevVideo, isPlaying: true
                                }))
                              }}
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
    </>
  )
}

export default VideoCarousel