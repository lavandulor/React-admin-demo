import React , { Component } from 'react';
import { Icon , Steps } from 'antd'
import EAudio from '../EAudio/index'
import EVideo from '../EVideo/index'
import Zmage from 'react-zmage'
import './index.less'
const Step = Steps.Step;
class InfoDetail extends Component{
    constructor () {
        super();
        this.state = {
            isPlay: false,//是否有音频在播放
        }
    }
    play(obj){
        this.setState({
            isPlay: obj
        });
    }
    showBase = () => {
        this.props.onShowCallBack();
    }

    render() {
        const { detailInfo } = this.props;
        const getStepIcon = ((showState)=>{
            if(showState === '1'){
                return <div className="icon-report"></div>
            }else if(showState === '2'){
                return <div className="icon-process"></div>
            }else if(showState === '3'){
                return <div className="icon-finish"></div>
            }
        })
        const getPhotoItem = ((fileList) =>{
            if(!fileList){
                return [];
            }
            let infoPhoto = [];
            const files = fileList.map((file) => {
                let fObj = {...file};
                fObj.src= file.filePath;
                return fObj;
            });
            files.forEach((file,index) => {
                if(file.fileType === 1){
                    infoPhoto.push(<li key={"photo"+index + file.src}><figure><Zmage src={file.src} set={files} defaultPage={index}/></figure></li>)
                }else if(file.fileType === 4){
                    infoPhoto.push(<EVideo key={"video"+index + file.src} src={file.src} firstFrame={file.firstFrame}/>)
                }
            });
            return infoPhoto;  
        })
        const stepItem = detailInfo.map((item, index) => {
            return (
                <Step 
                    key={'Step'+ index}
                    icon={getStepIcon(item.showState)} 
                    title={
                        <div className="base-info">
                            <div>时间：{item.time}</div>
                            <div>上报人：{item.name}</div>
                            <div>地址：{item.address}</div>
                            <div>情况描述：{item.remark}</div>
                            <div className={'icon-level-'+item.severity}></div>
                        </div>
                    }
                    status="process" 
                    description={<div className="media-info">
                        <div className="info-photo">
                            <ul className="figure-list">
                                {getPhotoItem(item.fileList)}
                            </ul>
                        </div>
                        {
                            item.voice?
                            <div className="info-audio">
                                <EAudio id={index} src={item.voice} play={this.play.bind(this)} isPlay={this.state.isPlay}></EAudio>
                            </div>:''
                        }
                    </div>}
                />
            )
        })
        return (
            <div className={"process-wrap "+this.props.type}>
                { 
                    <div className="process-title">
                        <span>过程详情</span>
                        <Icon type="rollback" onClick={this.showBase}>返回</Icon>
                    </div>
                }
                <Steps direction="vertical" size="small" current={1} className="process-detail-wrap">
                    {stepItem}
                </Steps>
            </div>
        )
    }
}

export default InfoDetail