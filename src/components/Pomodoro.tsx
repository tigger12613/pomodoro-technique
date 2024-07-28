import * as React from 'react';
import { Button, Col, NavLink, Row, Container } from 'react-bootstrap';
import './Pomodoro.css'
import { useInterval } from '../functions/useInterval'
import ringer from "../assets/music/cute_magical_bell.mp3";
import pianoSound from "../assets/music/piano.mp3";
import notification from "../assets/music/notification_sound.mp3"
import smsSound from "../assets/music/sms.mp3"
import { AudioVolume } from './AudioVolume';

export interface IPomodoroProps {
}
enum timeState {
    workTime = "work time",
    shortBreak = "short break",
    longBreak = "long break"
}

export function Pomodoro(props: IPomodoroProps) {

    const [workTime, setWorkTime] = React.useState<number>(25)
    const [shortBreakTime, setShortBreakTime] = React.useState<number>(5)
    const [longBreakTime, setLongBreakTime] = React.useState<number>(30)
    const [isStartCountDown, setIsStartCountDown] = React.useState<boolean>(false)
    const [nowCycle, setNowCycle] = React.useState<number>(0)
    const [nowState, setNowState] = React.useState<timeState>(timeState.workTime)
    const [longCycle, setLongCycle] = React.useState<number>(4)
    const [startCountDownTime, setStartCountDownTime] = React.useState<number | null>(null)
    const [lessTime, setLessTime] = React.useState<number>(0)
    const [pauseTime, setPauseTime] = React.useState<number | null>(null)
    const [pausePeriod, setPausePeriod] = React.useState<number>(0)
    const [canChange, setCanChange] = React.useState<boolean>(true)

    const [volume, setVolume] = React.useState<number>(100)

    const piano = new Audio(pianoSound)
    const sms = new Audio(smsSound)


    React.useEffect(()=>{
        setLessTime(workTime*60*1000)
    },[workTime])

    useInterval(() => {
        if (startCountDownTime != null) {
            if (isStartCountDown) {
                let nowTime = Date.now()
                let tmp: number
                switch (nowState) {
                    case timeState.workTime: {
                        tmp = workTime
                        break
                    }
                    case timeState.shortBreak: {
                        tmp = shortBreakTime
                        break
                    }
                    case timeState.longBreak: {
                        tmp = longBreakTime
                        break
                    }
                }
                let tmpLesstime = tmp * 60 * 1000 - (nowTime - startCountDownTime) + pausePeriod

                if (tmpLesstime < 0) {
                    setStartCountDownTime(Date.now())
                    switch (nowState) {
                        case timeState.workTime: {
                            if (nowCycle < longCycle) {
                                setNowState(timeState.shortBreak)
                            } else {
                                setNowState(timeState.longBreak)
                            }
                            playAudio(piano,volume,5000)
                            break
                        }
                        case timeState.shortBreak: {
                            setNowState(timeState.workTime)
                            setNowCycle(nowCycle + 1)
                            playAudio(sms,volume,5000)
                            break
                        }
                        case timeState.longBreak: {
                            setNowState(timeState.workTime)
                            setNowCycle(0)
                            playAudio(sms,volume,5000)
                            break
                        }
                    }
                    
                    console.log("new State")
                } else {
                    setLessTime(tmpLesstime)
                }


            }
        }
        //console.log(startCountDownTime,pauseTime,pausePeriod)
    }, 100)

    const playAudio = (audio:HTMLAudioElement,volumn:number, ms:number) => {
        return new Promise((resolve, reject) => {
            if (audio && ms) {
                audio.loop = false
                audio.play()
                setTimeout(() => {
                    audio.loop = false
                }, ms);
            } else {
                reject();
            }
        });
    };


    const startPauseCountDown = () => {
        setCanChange(false)
        //press start
        if (isStartCountDown == false) {
            setIsStartCountDown(true)
            if (startCountDownTime == null) {
                setStartCountDownTime(Date.now())
            } else {
                if (pauseTime != null) {
                    setPausePeriod(pausePeriod + Date.now() - pauseTime)
                }
            }
            setPauseTime(null)
        } else {
            setIsStartCountDown(false)
            setPauseTime(Date.now())
        }

    }

    const stopAndClearCountDown = () => {
        setNowCycle(0)
        setCanChange(true)
        setIsStartCountDown(false)
        setStartCountDownTime(null)
        setLessTime(workTime * 60 * 1000)
        setPausePeriod(0)
        setNowState(timeState.workTime)
    }

    const setWorkCountDown = (minutes: number) => {
        minutes = Math.floor(minutes)
        if (minutes > 60) {
            minutes = 60
        }
        if (minutes < 0) {
            minutes = 0
        }
        setWorkTime(minutes)
    }
    const setShortBreakCountDown = (minutes: number) => {
        minutes = Math.floor(minutes)
        if (minutes > 60) {
            minutes = 60
        }
        if (minutes < 0) {
            minutes = 0
        }
        setShortBreakTime(minutes)
    }
    const setLongBreakCountDown = (minutes: number) => {
        minutes = Math.floor(minutes)
        if (minutes > 60) {
            minutes = 60
        }
        if (minutes < 0) {
            minutes = 0
        }
        setLongBreakTime(minutes)
    }
    const setShortLongCycle = (times: number) => {
        times = Math.floor(times)
        if (times > 10) {
            times = 10
        }
        if (times < 0) {
            times = 0
        }
        setLongCycle(times)
    }

    const getbackgroundColor = (): string => {
        switch (nowState) {
            case timeState.workTime: {
                return "#DBB6B2"
            }
            case timeState.shortBreak: {
                return "#61A3C9"
            }
            case timeState.longBreak: {
                return "#63BFB8"
            }
        }
    }
    React.useEffect(()=>{
        sms.volume = volume/100
        // sms.play()
    },[volume])
    const leadingZero = (code :number, dataLength : number) =>{
        var str = '0000000000' + code;
        return str.slice(0 - dataLength);
    }

    return (
        <div className='pomodoro' style={{ "backgroundColor": getbackgroundColor() }}>
            <Container>
                <div className='bigbox'>
                    <div className='timer'>
                        <text>{Math.floor(lessTime / 1000 / 60)}</text><text>:</text><text>{leadingZero(Math.floor(lessTime / 1000 % 60),2)}</text>
                        <br />
                        {/* <text>{lessTime}</text> */}

                    </div>
                    <Row>
                        <Col>
                            <div>
                                <label htmlFor="customRange3" className="form-label">Work time</label>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <input type="range" className="form-range" min="0" max="60" step="1"
                                    value={workTime}
                                    disabled={!canChange}
                                    onChange={(e) => { setWorkCountDown(Number(e.target.value)) }} />
                            </div>
                        </Col>
                        <Col>
                            <input type="text" value={workTime} onChange={(e) => { setWorkCountDown(Number(e.target.value)) }} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                <label htmlFor="customRange3" className="form-label">Short break time</label>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <input type="range" className="form-range" min="0" max="30" step="1"
                                    value={shortBreakTime}
                                    disabled={!canChange}
                                    onChange={(e) => { setShortBreakCountDown(Number(e.target.value)) }} />
                            </div>
                        </Col>
                        <Col>
                            <input type="text" value={shortBreakTime} onChange={(e) => { setShortBreakCountDown(Number(e.target.value)) }} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>
                                <label htmlFor="customRange3" className="form-label">Long break time</label>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <input type="range" className="form-range" min="0" max="60" step="5"
                                    value={longBreakTime}
                                    disabled={!canChange}
                                    onChange={(e) => { setLongBreakCountDown(Number(e.target.value)) }} />
                            </div>
                        </Col>
                        <Col>
                            <input type="text" value={longBreakTime} onChange={(e) => { setLongBreakCountDown(Number(e.target.value)) }} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div>
                                <label htmlFor="customRange3" className="form-label">Long break cycle</label>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <input type="range" className="form-range" min="0" max="10" step="1"
                                    value={longCycle}
                                    disabled={!canChange}
                                    onChange={(e) => { setShortLongCycle(Number(e.target.value)) }} />
                            </div>
                        </Col>
                        <Col>
                            <input type="text" value={longCycle} onChange={(e) => { setShortLongCycle(Number(e.target.value)) }} />
                        </Col>
                    </Row>
                    <AudioVolume setVolume={setVolume} volume={volume} />

                    <Row className="start-stop-btn">
                        <Col>
                            <Button onClick={startPauseCountDown}>{isStartCountDown ? "Pause" : "Start"}</Button>
                        </Col>
                        <Col>
                            <Button onClick={stopAndClearCountDown}>Stop</Button>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
}
