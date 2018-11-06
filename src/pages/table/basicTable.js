import React from 'react';
import {Card, Table, Modal, Button, message} from 'antd';
import axios from '../../axios/index';
import Utils from '../../utils/utils'

export default class BasicTable extends React.Component{

    state = {
        dataSource2 : []
    }

    params = {
        page: 1
    }
    
    componentDidMount(){
        const data = [
            {
                id: '1',
                userName: 'Jack',
                sex: '1',
                state: '1',
                interset: '1',
                birthday: '1994-02-28',
                address: '杭州市西湖区西园八路2号',
                time: '09:00'
            },
            {
                id: '2',
                userName: 'Tom',
                sex: '1',
                state: '1',
                interset: '1',
                birthday: '1994-02-28',
                address: '杭州市西湖区西园八路2号',
                time: '09:00'
            },
            {
                id: '3',
                userName: 'Lily',
                sex: '1',
                state: '1',
                interset: '1',
                birthday: '1994-02-28',
                address: '杭州市西湖区西园八路2号',
                time: '09:00'
            }
        ]
        data.map((item, index) => {
            return item.key = index
        })
        this.setState({
            dataSource: data
        })
        this.request();
    }

    // 动态获取mock数据
    request = () => {
        let _this = this;
        axios.ajax({
            url: '/table/list',
            data: {
                params:{
                    page: this.params.page,
                },
            }
        }).then((res)=>{
            if(res.code === 0){
                console.log(res)
                res.result.list.map((item, index) => {
                    return item.key = index
                })
                this.setState({
                    dataSource2: res.result.list,
                    selectedRowKeys: [],
                    selectedRows: null,
                    pagination: Utils.pagination(res, (current)=>{
                        _this.params.page = current;
                        this.request();
                    })
                })
            }
        })
    }

    onRowClick = (record, index) => {
        let selectKey = [index];
        Modal.info({
            title: '信息',
            content: `用户名：${record.userName}, 用户爱好：${record.interset}`
        })
        this.setState({
            selectedRowKeys: selectKey,
            selectedItem: record
        })
    }

    // 多选执行删除动作
    handleDelete = (()=>{
        let rows = this.state.selectedRows;
        let ids = [];
        rows.map((item)=>{
            return ids.push(item.id)
        })
        Modal.confirm({
            title: '删除提示',
            content: `您确定要删除这些数据吗？${ids.join(',')}`,
            onOk:()=>{
                message.success('删除成功')
                this.request();
            }
        })
    })

    render(){
        const columns = [
            {
                title: '序号',
                dataIndex: 'id'
            },
            {
                title: '用户名',
                dataIndex: 'userName'
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render (sex){
                    return sex === 1 ? '男': '女'
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                render (state){
                    let config = {
                        "1":'咸鱼一条',
                        "2":'风华浪子',
                        "3":'北大才子',
                        "4":'淘宝UED',
                        "5":'创业者'
                    }
                    return config[state]
                }
            },
            {
                title: '爱好',
                dataIndex: 'interset',
                render (interset){
                    let config = {
                        "1":'篮球',
                        "2":'游泳',
                        "3":'美食',
                        "4":'登山',
                        "5":'健身',
                        "6":'摄影',
                        "7":'美食',
                        "8":'唱歌',
                        "9":'绘画',
                        "10":'下棋',
                        "11":'游戏',
                        "12":'社交'
                    }
                    return config[interset]
                }
            },
            {
                title: '生日',
                dataIndex: 'birthday'
            },
            {
                title: '地址',
                dataIndex: 'address'
            },
            {
                title: '早起时间',
                dataIndex: 'time'
            }
        ]
    
        const selectedRowKeys = this.state.selectedRowKeys;
        
        const rowSelection = {
            type: 'radio',
            selectedRowKeys
        }
        const rowCheckSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        }
        return (
            <div>
                <Card title="基础表格">
                    <Table
                        bordered
                        columns = {columns}
                        dataSource = {this.state.dataSource}
                        pagination = {false}
                    >
                    </Table>
                </Card>
                <Card title="动态数据渲染表格-Mock" style={{margin: '10px 0'}}>
                    <Table
                        bordered
                        columns = {columns}
                        dataSource = {this.state.dataSource2}
                        pagination = {false}
                    >
                    </Table>
                </Card>
                <Card title="Mock-单选" style={{margin: '10px 0'}}>

                    <Table
                        bordered
                        columns = {columns}
                        rowSelection = {rowSelection}
                        onRow={(record, index)=>{
                            return {
                                onClick: ()=>{
                                    this.onRowClick(record, index);
                                },       // 点击行
                            }
                        }}
                        dataSource = {this.state.dataSource2}
                        pagination = {false}
                    >
                    </Table>
                </Card>
                <Card title="Mock-多选" style={{margin: '10px 0'}}>
                    <div>
                        <Button onClick={this.handleDelete}>删除</Button>
                    </div>
                    <Table
                        bordered
                        columns = {columns}
                        rowSelection = {rowCheckSelection}
                        dataSource = {this.state.dataSource2}
                        pagination = {false}
                    >
                    </Table>
                </Card>
                <Card title="Mock-表格分页" style={{margin: '10px 0'}}>
                    <Table
                        bordered
                        columns = {columns}
                        dataSource = {this.state.dataSource2}
                        pagination = {this.state.pagination}
                    >
                    </Table>
                </Card>
            </div>
        )
    }
}