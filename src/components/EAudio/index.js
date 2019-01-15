import React, {Component} from 'react';
import {Form} from 'antd';
import './index.less';
import pauseButton from './images/pause.png'
import playButton from './images/play.gif'

class EAudio extends Component{
    constructor(props) {
        super(props);
          console.log(props.src)
        this.state = {
            isPlay: false,
            isMuted: false,
            volume: 100,
            allTime: 0,
            currentTime: 0,
            value:10,
            songs: props.src
        };
    }
    
    //播放按钮
    play=()=>{
        this.setState({
            isPlay: !this.state.isPlay
        })
    }

    millisecondToDate(time) {
        const second = Math.floor(time % 60);
        // let minite = Math.floor(time / 60);
        // let hour
        // if(minite > 60) {
        //   hour = minite / 60
        //   minite = minite % 60
        //   return `${Math.floor(hour)}:${Math.floor(minite)}:${Math.floor(second)}`
        // }
        return `${second >= 10 ? second : `0${second}`}"`;
    }

    controlAudio(type, value) {
        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);
        switch(type) {
            case 'allTime':
                if(audio){
                    this.setState({
                        allTime: audio.duration
                    });
                }else{
                    this.setState({
                        allTime: 0
                    });
                }
                break;
            case 'play':
                audio.play();
                this.setState({
                    isPlay: true
                });
                break;
            case 'pause':
                audio.pause();
                this.setState({
                    isPlay: false
                });
                break;
            case 'muted':
                this.setState({
                    isMuted: !audio.muted
                });
                audio.muted = !audio.muted;
                break;
            case 'changeCurrentTime':
                this.setState({
                    currentTime: value
                });
                audio.currentTime = value;
                if(value === audio.duration) {
                    this.setState({
                        isPlay: false
                    });
                }
                break;
            case 'getCurrentTime':
                this.setState({
                    currentTime: audio.currentTime
                });
                if (audio.currentTime === audio.duration) {
                    this.setState({
                        isPlay: false
                    });
                }
                break;
            case 'changeVolume':
                audio.volume = value / 100;
                this.setState({
                    volume: value,
                    isMuted: !value
                });
                break;
            default:
                audio.play();
                this.setState({
                    isPlay: true
                });
                break;  
        }
    }

    render(){
        let {isPlay, allTime, currentTime, songs} = this.state;
        // let audio_time=currentTime/allTime*100;
        return(
            <div style={{width:'100%',height:'100%',overflow:'hidden'}}>
                <div className="Personage-introduction">
                    <div className="personal-choices">
                        <Form>
                            <div className="audio_music">
                                <div className="audioBox">
                                    <audio
                                        id={`audio${this.props.id}`}
                                        src={songs}
                                        preload="true"
                                        onCanPlay={() => this.controlAudio('allTime')}
                                        onTimeUpdate={(e) => this.controlAudio('getCurrentTime')}
                                    >
                                        您的浏览器不支持 audio 标签。
                                    </audio>
                                    <div className="auido-photos" onClick={() => this.controlAudio(isPlay ? 'pause' : 'play')}>
                                        <img src={this.state.isPlay? playButton : pauseButton} alt=""/>
                                        <span className="startTime">{isPlay ?   this.millisecondToDate(currentTime): this.millisecondToDate(allTime)}</span>
                                    </div>
                            </div>
                        </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default EAudio;