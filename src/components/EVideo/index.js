import React , { Component, Fragment} from 'react';
import { Modal} from 'antd';
import { Player } from 'video-react';
import './index.less'
import "./video-react.css";
 class EVideo extends Component{

    state = {
        visible: false
    }

    handleOpen = () =>{
        this.setState({
            visible: true
        })
    }
    handleClose = () =>{
        this.setState({
            visible: false
        })
    }

    render(){
        return (
            <Fragment>
                <div className="video-pre-warp" onClick={this.handleOpen}>
                    <img src={this.props.firstFrame} alt=""/>
                    <div className="video-play-btn"></div>
                </div>
                <Modal
                    title="播放视频"
                    visible={this.state.visible}
                    onCancel={this.handleClose}
                    footer={null}
                >
                    <Player
                        playsInline
                        muted={false}
                        autoPlay
                        poster={this.props.firstFrame}
                        width="500px"
                        height="500px"
                    >
                        <source
                            src={this.props.src}
                            type="video/mp4"
                        />
                    </Player>
                </Modal>    
            </Fragment>
        )
    }
}

export default EVideo