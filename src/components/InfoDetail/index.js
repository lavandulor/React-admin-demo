import React , { Component } from 'react';
import { Icon, Skeleton} from 'antd'
import EAudio from '../EAudio/index'
import EVideo from '../EVideo/index'
import Zmage from 'react-zmage'
import './index.less'

class InfoDetail extends Component{
    constructor () {
        super();
        this.state = {
            isPlay: false,//是否有音频在播放
            loading: true
        }
    }
    
    play(obj){
        this.setState({
            isPlay: obj
        });
    }

    showProcess = () => {
        this.props.onShowCallBack();
    }

    componentDidMount(){
        this.setState({
            loading: false,
        })
    }
    render() {
        const { loading } = this.state;
        const { detailInfo } = this.props;
        let reportInfo = {
            fileList: []
        }
        if(detailInfo){
           reportInfo = detailInfo[detailInfo.length - 1] 
        }

        const fileList = reportInfo.fileList.map((file) => {
            let fObj = {...file};
            fObj.src= file.filePath;
            return fObj;
        });

        let infoPhoto = [];
        //获取上报的数据
        fileList.forEach((file, index) => {
                if(file.fileType === 1){
                    infoPhoto.push(<li key={"photo"+index + file.src}><figure>
                        <Zmage src={file.src} alt="" set={fileList} defaultPage={index}/>
                    </figure></li>)
                }else if(file.fileType === 4){
                    infoPhoto.push(<EVideo key={"video"+index + file.src} src={file.src} firstFrame={file.firstFrame}/>)
                }
            }   
        );

        return (
            <div className={"info-detail "+this.props.type}>
                <Skeleton loading={loading}>
                    <div className="info-title">基本信息</div>
                    <div className="info-content">类型：{reportInfo.typeName}</div>
                    <div className="info-content">时间：{reportInfo.time}</div>
                    <div className="info-content">地址：{reportInfo.address}</div>
                    <div className="info-content">上报人：{reportInfo.name}</div>
                    <div className="info-content">情况描述：{reportInfo.remark}</div>
                    {reportInfo.concreteType?<div className="info-content">{reportInfo.concreteType}</div>:''}
                    <div className={"icon-level-"+reportInfo.severity}></div>
                    <div className="info-title">现场照片/视频</div>
                    <div className="info-photo">
                        <ul className="figure-list">
                            { infoPhoto }
                        </ul>
                    </div>
                    {
                        reportInfo.voice?
                        <div className="info-audio">
                            <EAudio id={'audio'+reportInfo.type+reportInfo.id} src={reportInfo.voice} play={this.play.bind(this)} isPlay={this.state.isPlay}></EAudio>
                        </div>:''
                    }
                    <div className="info-process" onClick={this.showProcess}>过程详情<Icon type="right"></Icon></div>
                </Skeleton>
            </div>
        )
    }
}

export default InfoDetail