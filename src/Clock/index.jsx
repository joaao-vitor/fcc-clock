import React, { useEffect, useRef, useState } from 'react'
import './Clock.scss'
import Beep from '../assets/audio/beep.wav'

export default function Clock() {
    const [sessionLength, setSessionLength] = useState(25)
    const [breakLength, setBreakLength] = useState(5)
    const [totalTimeLeft, setTotalTimeLeft] = useState(null)
    const [isRunning, setIsRunning] = useState(false)
    const [onBreak, setOnBreak] = useState(false)

    const [timerLabel, setTimerLabel] = useState('Session')

    const beep = useRef(null)

    useEffect(() => {
        setTotalTimeLeft(sessionLength * 60)
    }, [sessionLength])

    useEffect(() => {
        let interval;
        if (isRunning && totalTimeLeft > 0) {
            interval = setInterval(() => {
                setTotalTimeLeft((s) => s - 1);
            }, 1000);
        } else if (totalTimeLeft === 0) {
            beep.current.play()

            if (!onBreak) {
                setTotalTimeLeft(breakLength * 60);
                setOnBreak(true);
                setTimerLabel('Break');
            } else {
                setTotalTimeLeft(sessionLength * 60);
                setOnBreak(false);
                setTimerLabel('Session');
            }
        }

        return () => clearInterval(interval);
    }, [isRunning, onBreak, breakLength, sessionLength, totalTimeLeft]);

    const handleReset = () => {
        setSessionLength(25)
        setBreakLength(5)
        setTotalTimeLeft(25 * 60)
        setOnBreak(false)
        setIsRunning(false)
        setTimerLabel('Session')
        beep.current.pause()
        beep.current.currentTime = 0
    }
    const formatTime = () => {
        const minutes = Math.floor(totalTimeLeft / 60);
        const seconds = totalTimeLeft % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    const handlePlay = () => {
        setIsRunning(isRunning => !isRunning)
    }

    const handleIncrement = (timeFunc, timeState) => {
        if (timeState < 60)
            timeFunc(time => time + 1)

    }
    const handleDecrement = (timeFunc, timeState) => {
        if (timeState > 1)
            timeFunc(time => time - 1)
    }
    return (
        <div className='clock'>
            <h1>25 + 5 Clock</h1>
            <div className='timer'>
                <button id='start_stop' onClick={handlePlay}>
                    <i className="fa-solid fa-play"></i>
                    <i className="fa-solid fa-pause"></i>
                </button>
                <div>
                    <h3 id='timer-label'>{timerLabel}</h3>
                    <h2 id='time-left'>{formatTime()}</h2>
                </div>
                <button id='reset' onClick={handleReset}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                </button>
            </div>
            <div className='clock-config'>
                <div className='clock-divisor'>
                    <p id='break-label'>Break length</p>
                    <div>
                        <button id='break-increment' onClick={() => handleIncrement(setBreakLength, breakLength)}>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <span id='break-length'>{breakLength}</span>
                        <button id='break-decrement' onClick={() => handleDecrement(setBreakLength, breakLength)}>
                            <i className="fa-solid fa-minus"></i>
                        </button>
                    </div>
                </div>

                <div className='clock-divisor'>
                    <p id='session-label'>Session Length</p>
                    <div>
                        <button id='session-increment' onClick={() => handleIncrement(setSessionLength, sessionLength)}>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <span id='session-length'>{sessionLength}</span>
                        <button id='session-decrement' onClick={() => handleDecrement(setSessionLength, sessionLength)}>
                            <i className="fa-solid fa-minus"></i>
                        </button>
                    </div>
                </div>
            </div>

            <audio preload="auto" id="beep" ref={beep} src={Beep}></audio>
        </div>
    )
}
