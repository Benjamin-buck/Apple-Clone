import { useEffect, useRef, useState} from 'react';
import { hightlightsSlides } from '../constants'
import gsap from 'gsap';
import { replayImg } from '../utils';
import { playImg } from '../utils';
import { pauseImg } from '../utils';


const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [loadedData, setLoadedData] = useState([])

    
    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    })

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useEffect(() => {
        if(loadedData.length > 3) {
            if(!isPlaying) {
                videoRef.current[videoId].pause();
            } else {
                startPlay && videoRef.current[videoId].play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData])
    
    useEffect(() => {
        const currentProgress = 0;
        let span = videoSpanRef.current;

        if(span[videoId]) {
            // animate the progress of the video
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {

                },
                onComplete: () => {

                },
            })
        }
    }, [videoId, startPlay])

    const handleProcess = (type, i) => {
        // use a switch when there is multiple cases.
        switch (key) {
            // if the case is video end,
            case 'video-end':
                // set video state by getting the previous video state
                // spread the prevVideo array and set isEnd to true.
                // Increment the video ID
                setVideo((pre) => ({...pre, isEnd: true, videoId: i + 1}))
                break;
            // if we're at the last video, but not video end
            // want to set video     
            case 'video-last':
                setVideo((pre) => ({ ...pre, isLastVideo: true}))
                break;

            case 'video-reset':
                setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0}))
                break;

            case 'play':
                // is playing will be the opposite of (not)previous.isPlaying
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying}))
                break;
        
            default:
                return video;
        }
    }
    
    

  return (
    <>
        <div className="flex items-center">
            {hightlightsSlides.map((list, i) => (
                <div key={list.id} id="slider" className='pr-10 sm:pr-20'>
                    <div className='video-carousel_container'>
                        <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                            <video
                                id="video"
                                playsInline={true}
                                preload='auto'
                                muted
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
                                <p className='md:text-2xl text-xl font-medium' key={text}>{text}</p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className='relative flex-center mt-10'>
            <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
                {videoRef.current.map((_, i) => (
                    <span
                    key={i}
                    ref={(el) => (videoDivRef.current[i] = el)}
                    className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                    >
                        <span className='absolute h-full w-full rounded-full' ref={(el) => (videoSpanRef.current[i] = el)} />
                    </span>
                ))}
            </div>

            <button className='control-btn'>
                <img 
                src={isLastVideo ? replayImg :
                !isPlaying ? playImg : pauseImg
            } alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'} 
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