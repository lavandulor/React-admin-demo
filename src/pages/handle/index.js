import React, { Component, Fragment} from 'react';
import {Card, Button, Table, Modal, Row , Radio, Divider, message, Drawer} from 'antd';
import Utils from '../../utils/utils'
import BaseForm from './../../components/BaseForm';
import InfoDetail from './../../components/InfoDetail';
import ProcessDetail from './../../components/ProcessDetail';
import EventForm from './../../components/EventForm'
import axios from './../../axios/index';
import './index.less'

class Handle extends Component {

    state = {
        list: [],
        isShowAddForm: false,
        isProcessShow: false,
        modalType: '',
        detailState: 0
    }

    params = {
        page: 1,
        pageSize: 10,
        state: 0
    }

    formList = [
        {
            type: 'TREESELECT',
            label: '上报类型',
            field: 'queryType',
            placeholder: '全部',
            initialValue: '0',
            width: 175,
            list:[{
                title: '全部',
                value: '0',
                key: 'queryType0',
            },{
                title: '异常路况',
                value: '1',
                key: 'queryType1',
                children: [{
                    title: '拥堵',
                    value: '1-1',
                    key: 'concreteType1',
                }, {
                    title: '施工',
                    value: '1-2',
                    key: 'concreteType2',
                }, {
                    title: '积水',
                    value: '1-3',
                    key: 'concreteType3',
                }, {
                    title: '危险',
                    value: '1-4',
                    key: 'concreteType4',
                }],
            },{
                title: '事件处理',
                value: '2',
                key: 'queryType2',
                children: [{
                    title: '事故',
                    value: '2-1',
                    key: 'concreteType5',
                },{
                    title: '其他',
                    value: '2-2',
                    key: 'concreteType6',
                }]
            },{
                title: '设备上报',
                value: '3-3',
                key: 'concreteType7',
            },{
                title: '设施上报',
                value: '3-4',
                key: 'concreteType8',
            }]
        },
        {
            type: '时间查询'
        },
        {
            type: 'SELECT',
            label: '严重程度',
            field: 'severity',
            placeholder: '全部',
            initialValue: '',
            width: 175,
            list:[{id: '', name: '全部'},{id: '1', name: '低'},{id: '2', name: '中'},{id: '3', name: '高'}]
        }
    ]

    componentDidMount() {
        let pageSize = Utils.getPageSize();
        this.params.pageSize = pageSize
        this.requestList();
    }

    // 默认请求接口数据
    requestList = () => {
        axios.requestList(this, '/service/getReportList.sp', this.params)
    }

    // 新增事件窗口打开
    handleEvent = (type) => {
        var _this = this;
        switch (type){
            case 'add':
                this.setState({
                    isShowAddForm: true,
                    modalType: type
                })
                break;
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

    // 上报事件
    handleAddSubmit = () => {
        let data = this.EventForm.props.form.getFieldsValue();
        let srcList = data.srcList.map((file)=>{
            return {
                fileType: file.fileType,
                filePath: file.filePath,
            }
        })
        let param = {
            ...data,
            srcList: JSON.stringify(srcList)
        }
        axios.ajax({
            url: '/service/report.op',
            data: {
                params: param
            }
        }).then((res) => {
            if (res.state === 0) {
                message.success(`事件上报成功`)
                this.EventForm.props.form.resetFields();
                this.setState({
                    isShowAddForm: false
                })
                this.requestList();
            } else {
                message.error(res.message)
            }
        })
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
                    isShowAddForm: false,
                })
                this.requestList();
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
                this.requestList();
            } else {
                message.error(res.message)
            }
        })
    }

    // 查询条件过滤
    handleFilter = (params) => {
        let beginTime = ''
        let endTime = ''
        let type = []
        if(params.queryType){
            type = Utils.formatQueryType(params.queryType)  // [queryType, concreteType]
        }
        if(params.beginTime){
            beginTime = params.beginTime.format('YYYY-MM-DD')
        }
        if(params.endTime){
            endTime = params.endTime.format('YYYY-MM-DD')
        }
        let data = {
            ...params,
            queryType: type[0],
            concreteType: type[1],
            endTime,
            beginTime
        }
        this.params = Object.assign(this.params, data);
        this.requestList();
    }

    // 状态查询按钮
    handleStateChange = (e) => {
        let state = e.target.value;
        this.params.page = 1;
        this.handleFilter({state})
    }

    // 打开详情显示
    handleRowClick(record){
        let type = record.type;
        let id =  record.id;
        let state = record.state;
        let arrow_dom = document.getElementById("detailArrow")
        arrow_dom.style.top = `${(record.key + 1)*50}px`
        axios.ajax({
            url: '/service/getReportDetail.sp',
            data: {
                params: {
                    id,
                    type
                }
            }
        }).then((res) => {
            if (res.state === 0) {
                this.setState({
                    isProcessShow: false,
                    detailInfo: res.data,
                    detailType: type,
                    detailId: id,
                    detailState: state
                })
            } else {
                message.error(res.message)
            }
        })
    }

    showProcess = () => {
        this.setState({
            isProcessShow: true
        })
    }

    closeProcess = () =>{
        this.setState({
            isProcessShow: false
        })
    }

    render() {
        const severityArray = ["低", "中", "高"]
        const columns = [{
            title: '上报时间',
            dataIndex: 'time',
            width: 150
        }, {
            title: '类型',
            dataIndex: 'typeName',
            width: 120
        }, {
            title: '地址',
            dataIndex: 'address'
        }, {
            title: '严重程度',
            dataIndex: 'severity',
            render: (severity) => severityArray[severity],
            width: 100,
        }, {
            title: '上报人',
            dataIndex: 'realName',
            width: 100,
        }]
        return ( 
            <Fragment>
                <div className="handle-table">
                    <Card>  
                        <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                    </Card> 
                    <Card bordered={false} className="btn-wrap">
                        <Radio.Group defaultValue="0" buttonStyle="solid" onChange={this.handleStateChange}>
                            <Radio.Button value="0">待处理</Radio.Button>
                            <Radio.Button value="1">已完成</Radio.Button>
                        </Radio.Group>
                        <Button icon="plus" onClick = {()=>this.handleEvent('add')} style={{float: 'right', color:''}}>添加</Button>
                    </Card>
                </div>  
                <Row className="handle-container">
                    <div className="table-wrap">
                        <Table
                            bordered = {false}
                            columns = {columns}
                            dataSource = {this.state.list}
                            pagination = {this.state.pagination}
                            onRow={(record) => {
                                return {
                                    onClick: this.handleRowClick.bind(this, record)
                                };
                            }}
                        /> 
                    </div>
                    <div className="detail-wrap">
                        <div className="detail-arrow" id="detailArrow"></div>
                        <div className="handle-base-info">
                            <InfoDetail type="handle" detailInfo={this.state.detailInfo} onShowCallBack={this.showProcess}/>
                        </div>
                        {
                            this.state.detailState === 0?<div className="btn-wrap">
                                <div className="btn" onClick={()=>this.handleEvent('feedback')}>跟踪反馈</div>
                                <Divider type="vertical" className="line"/>
                                <div className="btn" onClick={()=>this.handleEvent('finish')}>完成</div>
                            </div>: ''
                        }
                    </div>
                </Row> 
                <Drawer
                    placement='right'
                    mask={false}
                    width={'26%'}
                    closable={false}
                    visible={this.state.isProcessShow}
                    className="handle-detail-drawer"
                >
                    <div className="handle-content">
                        <div className="handle-base-info">
                            <ProcessDetail type="handle" detailInfo={this.state.detailInfo} onShowCallBack={this.closeProcess}/>
                        </div>
                        {
                            this.state.detailState === 0?<div className="btn-wrap">
                                <div className="btn" onClick={()=>this.handleEvent('feedback')}>跟踪反馈</div>
                                <Divider type="vertical" className="line"/>
                                <div className="btn" onClick={()=>this.handleEvent('finish')}>完成</div>
                            </div>:''
                        }
                    </div>
                </Drawer>
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
            </Fragment>
        )
    }
}

export default Handle


