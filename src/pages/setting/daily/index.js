import React from 'react';
import {Card, Table} from 'antd';
import axios from './../../../axios/index';
import BaseForm from './../../../components/BaseForm';

export default class City extends React.Component {

    state = {
        list: [],
        isShowOpenCity: false
    }

    params = {
        page: 1,
        pageSize: 10
    }

    formList = [
        {
            type: 'INPUT',
            label: '操作人姓名',
            field: 'name',
            placeholder: '请输入操作人姓名',
            width: 150
        },
        {
            type: 'INPUT',
            label: '操作类型',
            field: 'content',
            placeholder: '请输入操作类型',
            width: 150
        },
    ]

    componentDidMount() {
        this.requestList();
    }

    // 默认请求接口数据
    requestList = () => {
        axios.requestList(this, '/system/getLogList.sp', this.params, true)
    }

    render() {
        const columns = [{
            title: '日志编号',
            dataIndex: 'id'
        }, {
            title: '终端类型',
            dataIndex: 'sourceType'
        }, {
            title: '操作人姓名',
            dataIndex: 'name'
        }, {
            title: '操作时间',
            dataIndex: 'time'
        }, {
            title: '操作类型',
            dataIndex: 'content'
        }, {
            title: '访问IP',
            dataIndex: 'terminalIp'
        }]
        return ( 
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <div className="content-wrap">
                    <Table
                        bordered
                        columns = {columns}
                        dataSource = {this.state.list}
                        pagination = {this.state.pagination}
                    /> 
                </div>
            </div>
        )
    }
}
