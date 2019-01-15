import React, { Component }from 'react'
import {message, Divider, Modal} from 'antd'
import {Map, Markers, InfoWindow} from 'react-amap'
import axios from './../../axios/index';
import InfoDetail from './../../components/InfoDetail';
import ProcessDetail from './../../components/ProcessDetail';
import EventForm from './../../components/EventForm';
import { connect } from 'react-redux';
import { changeActiveId } from './../../redux/action';

import './map.less'

class IndexMap extends Component{

    map = ''

    constructor(props){
        super()
        let _this = this
        this.amapEvents = {
            created: (mapInstance) => {
                this.map = mapInstance
            }
        }
        this.markersEvents = {
            click: (e, originalMarkerInstance) => {
                let extData = e.target.getExtData();
                let iconContent = `<div class="markerIcon icon-${extData.imgType}-${extData.state}"></div>`
                originalMarkerInstance.setContent(iconContent)
                _this.clickShowInfoWindow(extData.id, extData.type, extData.position.longitude, extData.position.latitude, extData.state)
                const { dispatch } = this.props;
                dispatch(changeActiveId(`${extData.id}${extData.type}`))
            }
        }
        this.infoWindowEvents = {
            close: (e) =>{
                _this.setState({
                    showInfoWindow: false,
                })
            }
        }
    }

    state = {
        showNearList: false,
        showInfoWindow: false,
        isProcessShow: false,
        position: {longitude: 120.152416, latitude: 30.276612},
        markers: [],
        nearList: [],
        zoom: 14
    }

    // 地图坐标修改
    renderMarkerLayout(extData){
        return <div className={'markerIcon '+extData.icon}></div>
    }

    callInfoWindowData(id, type, x, y, state){
        var _this = this
        this.map.panTo([x, y]);
        this.map.setZoom(16)
        axios.ajax({
            url: '/service/getReportDetail.sp',
            data: {
                params: {
                    id,
                    type,
                    isShowLoading: false
                }
            }
        }).then((res) => {
            if (res.state === 0) {
                _this.map.panTo([x, y]);
                _this.map.setZoom(18)
                _this.setState({
                    showNearList: false,
                    showInfoWindow: true,
                    isProcessShow: false,
                    detailInfo: res.data,
                    detailType: type,
                    detailId: id,
                    detailState: state,
                    position: {
                        longitude: x,
                        latitude: y
                    }
                })
            } else {
                message.error(res.message)
            }
        })
    }

    clickShowInfoWindow(id, type, x, y, state){
        var _this = this;
        axios.ajax({
            url: '/statistics/getNearCoordinate.sp',
            data: {
                params: {
                    id,
                    type
                }
            }
        }).then((res) => {
            if (res.state === 0) {
                if(res.data.length > 0){
                    _this.map.setZoom(18)
                    _this.setState({
                        showNearList: true,
                        showInfoWindow: false,
                        isProcessShow: false,
                        nearList: res.data,
                        detailType: type,
                        detailId: id,
                        detailState: state,
                        position: {
                            longitude: x,
                            latitude: y
                        }
                    })
                }else{
                    _this.callInfoWindowData(id, type, x, y, state)
                }
            } else {
                message.error(res.message)
            }
        })
    }

    showProcess = () =>{
        this.setState({
            isProcessShow: true,
        })
    }

    closeProcess = () =>{
        this.setState({
            isProcessShow: false,
        })
    }

     // 新增事件窗口打开
     handleEvent = (type) => {
        var _this = this;
        switch (type){
            case 'feedback': 
                this.setState({
                    isShowAddForm: true,
                    modalType: type
                })
                break;
            case 'finish':
                Modal.confirm({
                    title: '提示',
                    content: `确定编号为${this.state.detailId}号的${this.state.detailInfo[this.state.detailInfo.length-1].typeName}事件反馈成功？`,
                    onOk() {
                        _this.handleEventFinish();
                    }
                });
                break;
            default:
                break;
        } 
    }

    // 反馈事件
    handleFeedbackSubmit = () => {
        let data = this.EventForm.props.form.getFieldsValue();
        const reportInfo = this.state.detailInfo[this.state.detailInfo.length-1]
        let srcList = data.srcList.map((file)=>{
            return {
                fileType: file.fileType,
                filePath: file.filePath,
            }
        })
        let param = {
            ...data,
            reportId: this.state.detailId,
            type: this.state.detailType,
            isAccomplish: data.isAccomplish?1:0,
            srcList: JSON.stringify(srcList)
        }
        axios.ajax({
            url: '/service/reportRecord.op',
            data: {
                params: param
            }
        }).then((res) => {
            if (res.state === 0) {
                message.success(`编号为${this.state.detailId}号的${reportInfo.typeName}事件反馈成功`)
                this.EventForm.props.form.resetFields();
                this.setState({
                    detailState: 1,
                    isShowAddForm: false,
                    showInfoWindow: false,
                    isProcessShow: false, 
                })
                this.props.handleFeedback()
            } else {
                message.error(res.message)
            }
        })
    }
    
    // 反馈事件完成
    handleEventFinish = () => {
        let param = {
            reportId: this.state.detailId,
            type: this.state.detailType,
            isAccomplish: 1,
        }
        axios.ajax({
            url: '/service/reportRecord.op',
            data: {
                params: param
            }
        }).then((res) => {
            if (res.state === 0) {
                message.success(`编号为${this.state.detailId}号的${this.state.detailInfo[this.state.detailInfo.length-1].typeName}事件反馈成功`)
                this.setState({
                    detailState: 1,
                    isShowAddForm: false,
                    showInfoWindow: false,
                    isProcessShow: false,
                })
                this.props.handleFeedback()
            } else {
                message.error(res.message)
            }
        })
    }

    componentDidMount(){
        let {data} = this.props
        this.setState({
            markers: data.map((item) => ({
                position: {
                    longitude: item.x,
                    latitude: item.y
                },
                icon: `icon-${item.imgType}-${item.state}`,
                imgType: item.imgType,
                state: item.state,
                id: item.id,
                type: item.type,
            }))
        })
    }

    componentWillReceiveProps(nextProps){
        let {data, clickData} = nextProps;
        if(clickData && clickData.id !== this.state.detailId){
            this.setState({
                position: {
                    longitude: clickData.x,
                    latitude: clickData.y
                }
            })
            this.callInfoWindowData(clickData.id, clickData.type, clickData.x, clickData.y, clickData.state)
        }
        this.setState({
            markers: data.map((item) => ({
                position: {
                    longitude: item.x,
                    latitude: item.y
                },
                icon: (item.isRead === '0' ? `icon-${item.imgType}-2`:`icon-${item.imgType}-${item.state}`),
                imgType: item.imgType,
                state: item.state,
                id: item.id,
                type: item.type,
            }))
        })
    }

    render(){
        const levelArray = ['低', '中', '高']
        const renderNearList = (list) => {
            return list.map((item, index) => {
                return (
                    <li className='list-item'  key= {`NearList${item.ID}${item.state}`}>
                        <div className="info-item" onClick={() => this.callInfoWindowData(item.ID, item.type, item.x, item.y, item.state)}>
                            <div className="left-wrap">
                                {item.isRead === '0'? <div className="red-point"></div>: ''}
                            </div>
                            <div className="right-wrap">
                                <div className="info-text name"><div className={"icon-type-"+item.type}></div>{item.typeName}</div>
                                <div className="info-text">{item.time}</div>
                                <div className="info-text">{item.address? item.address: '未知地址'}</div>
                                <div className="info-text">{item.remark}</div>
                                <div className="info-text">上报人：{item.realName}<span className="level">严重程度：{levelArray[item.severity]}</span></div>
                            </div>
                            <div className={"icon-level-"+item.state}></div>
                        </div>
                    </li>
                );
            })
        }
        return (
            <div className='container' style={this.props.type === 'min'?{'height': '40vh'}:{}}>
                <Map 
                    amapkey={'5cb56d78f0837312098802a98f6713f9'} version={'1.4.11'}
                    zoom={this.state.zoom}
                    center={this.state.position}
                    mapStyle={'amap://styles/c87712362b957ad674fb10bd535e6e19'}
                    viewMode={'3D'}
                    pitch={55}
                    events={this.amapEvents}
                >
                    <Markers
                        markers={this.state.markers}
                        render={this.renderMarkerLayout}
                        events={this.props.type === 'min'?'':this.markersEvents}
                        useCluster={{maxZoom: 17, zoomOnClick: true}}
                    ></Markers>
                    <InfoWindow
                        position={this.state.position}
                        visible={this.state.showNearList}
                        events={this.infoWindowEvents}
                        isCustom={false}
                        offset={[160,100]}
                    >
                        <ul className="near-list-wrap">
                            {renderNearList(this.state.nearList)}
                        </ul>
                    </InfoWindow>
                    <InfoWindow
                        position={this.state.position}
                        visible={this.state.showInfoWindow}
                        events={this.infoWindowEvents}
                        isCustom={false}
                        offset={[160,100]}
                    >
                        {
                            this.state.isProcessShow?
                            <ProcessDetail type="index" detailInfo={this.state.detailInfo} onShowCallBack={this.closeProcess}/>:
                            <InfoDetail onShowCallBack={this.showProcess} type="index" detailInfo={this.state.detailInfo}/>
                        }
                        {
                            this.state.detailState === 0 ?
                            <div className="btn-wrap">
                                <div className="btn" onClick={()=>this.handleEvent('feedback')}>跟踪反馈</div>
                                <Divider type="vertical" className="line"/>
                                <div className="btn" onClick={()=>this.handleEvent('finish')}>完成</div>
                            </div>:''
                        }
                    </InfoWindow>
                    <Modal
                        title={this.state.modalType === 'add' ?'上报事件':'反馈事件'}
                        visible={this.state.isShowAddForm}
                        onCancel={()=>{
                            this.EventForm.props.form.resetFields();
                            this.setState({
                                isShowAddForm: false
                            })
                        }}
                        onOk={this.state.modalType === 'add' ? this.handleAddSubmit: this.handleFeedbackSubmit}
                    >
                        <EventForm formType={this.state.modalType} wrappedComponentRef={(inst)=>{
                            this.EventForm = inst
                        }} />
                    </Modal>
                </Map>   
            </div>
        )
    }
}

export default connect()(IndexMap)