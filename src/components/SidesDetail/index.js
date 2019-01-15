import React, { Component } from 'react'
import { Drawer , Icon, Divider} from 'antd';
import InfoDetail from '../InfoDetail';
import ProcessDetail from '../ProcessDetail';
import './index.less'

class SidesList extends Component {
    state = { 
        baseVisible: true,
        detailInfo:[{"severity":1,"showState":"3","address":"杭州市下城区天水街道华侨新村华侨新村(天水巷)","x":"120.168226","name":"段童","y":"30.272282","remark":"备注","id":8,"time":"2018-12-17 09:45","fileList":[{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1545011073513微信图片_20180703094734.png","id":68,"fileType":1}]},{"showState":"2","address":"浙江省杭州市西湖区西园八路西园8路2号3幢靠近中国智谷西湖园区","x":"120.06373","name":"段童","y":"30.309601","remark":"噜噜噜","id":3,"time":"2018-12-11 15:18","fileList":[{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512727169.png","id":47,"fileType":1}]},{"showState":"2","address":"浙江省杭州市西湖区西园八路西园8路2号3幢靠近中国智谷西湖园区","x":"120.063781","name":"段童","y":"30.309573","remark":"图片","id":2,"time":"2018-12-11 15:17","fileList":[{"firstFrame":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544437543499.png","filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544437560185.mp4","id":18,"fileType":4},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512650800.png","id":46,"fileType":1}]},{"voice":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512456124.mp3","showState":"2","address":"浙江省杭州市西湖区西园八路西园8路2号3幢靠近中国智谷西湖园区","x":"120.063697","name":"段童","y":"30.309557","remark":"TUT我哦呢","id":1,"time":"2018-12-11 15:14","voiceTime":"3","fileList":[{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544437376729.png","id":17,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512443971.png","id":42,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512444109.png","id":43,"fileType":1}]},{"voice":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512160047.mp3","severity":0,"address":"浙江省杭州市西湖区西园八路西园8路2号3幢靠近中国智谷西湖园区","typeName":"[故障上报]-设备","remark":"空军建军节","showState":"1","x":"120.06375","name":"段童","y":"30.30956","concreteType":"所属系统：监控","id":3,"state":1,"time":"2018-12-11 15:09","voiceTime":"2","fileList":[{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512143468.png","id":33,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512143607.png","id":34,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512143706.png","id":35,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512143778.png","id":36,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512143859.png","id":37,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512143960.png","id":38,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512144047.png","id":39,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512144134.png","id":40,"fileType":1},{"filePath":"https://jtbaozdqw.oss-cn-shanghai.aliyuncs.com/abnormal/1544512144222.png","id":41,"fileType":1}]}],
    };
    closeDrawer = () => {
        this.setState({
            baseVisible: true
        })
        this.props.closeDetailCallBack(false)
    }

    showProcess = () => {
        this.setState({
            baseVisible: false
        })
    }

    showBase = () => {
        this.setState({
            baseVisible: true
        })
    }

    render() {
        const {visible} = this.props;
        return (
            <Drawer
                placement='left'
                mask={false}
                maskClosable={false}
                closable={false}
                visible={visible}
                width={253}
                className="detail-drawer"
            >
                <div className="return-nav-wrap" onClick={this.closeDrawer}>
                    <Icon type="left"></Icon>
                    <span>返回今日上报</span>
                </div>
                <div className="detail-info-wrap">
                    <div className="detail-info">
                        {this.state.baseVisible? <InfoDetail onShowCallBack={this.showProcess} type="index" detailInfo={this.state.detailInfo}/>:<ProcessDetail onShowCallBack={this.showBase} type="index" detailInfo={this.state.detailInfo} /> }
                    </div>
                    <div className="btn-wrap">
                        <div className="btn">跟踪反馈</div>
                        <Divider type="vertical" className="line"/>
                        <div className="btn">完成</div>
                    </div>
                </div>
            </Drawer>
        )
    }
}

export default SidesList