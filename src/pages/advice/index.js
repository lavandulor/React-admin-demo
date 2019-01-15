import React, { Component } from 'react';
import {Card, Table, Row, message} from 'antd';
import BaseForm from './../../components/BaseForm';
import axios from './../../axios/index';
// import Utils from './../../utils/utils';
import './index.less'

class Handle extends Component {

    state = {
        list: [],
        detailInfo: {}
    }

    params = {
        page: 1,
        pageSize: 10
    }

    formList = [
        {
            type: '日期查询'
        },
        {
            type: 'INPUT',
            label: '警员姓名',
            field: 'name',
            placeholder: '请输入警员姓名',
            width: 150
        },
        {
            type: 'INPUT',
            label: '警号',
            field: 'policeNumber',
            placeholder: '请输入警号',
            width: 150
        }
    ]

    componentDidMount() {
        this.requestList();
    }

    // 默认请求接口数据
    requestList = () => {
        axios.requestList(this, '/advice/getAdvicePage.sp', this.params, true)
    }

    // 查询条件过滤
    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    }

    handleRowClick(record){
        let id =  record.id;
        axios.ajax({
            url: '/advice/getAdviceDetail.sp',
            data: {
                params: {
                    id
                }
            }
        }).then((res) => {
            if (res.state === 0) {
                this.setState({
                    detailInfo: res.data,
                })
            } else {
                message.error(res.message)
            }
        })
    }

    render() {
        const columns = [{
            title: '上报时间',
            dataIndex: 'time',
            width: 120,
        }, {
            title: '姓名',
            dataIndex: 'name',
            width: 100,
        }, {
            title: '警号',
            dataIndex: 'policeNumber',
            width: 100,
        }, {
            title: '内容',
            dataIndex: 'content'
        }]
        return ( 
            <div>
                <Row className="advice-container">
                    <div className="advice-table">
                        <Card>  
                            <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                        </Card>
                        <div className="content-wrap" style={{marginTop: 10}}>
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
                    </div>
                    <div className="advice-info">
                        <div className="advice-base-info">
                            <div className="advice-detail">
                                <div className="advice-title" style={{marginBottom: 16}}>基本信息</div>
                                <div className="advice-content">上报时间：{this.state.detailInfo.time}</div>
                                <div className="advice-content">上报人警号：{this.state.detailInfo.policeNumber}</div>
                                <div className="advice-content" style={{marginBottom: 20}}>上报人姓名：{this.state.detailInfo.name}</div>
                                <div className="advice-title">内容描述</div>
                                <div className="advice-content">
                                    {this.state.detailInfo.content}
                                </div>
                            </div>
                        </div>
                    </div>
                </Row> 
            </div>
        )
    }
}

export default Handle
