import React from 'react';
import {Card, Table, Badge, Modal,Button, message} from 'antd';
import axios from '../../axios/index';

export default class HighTable extends React.Component{

    state = {
        dataSource: []
    }

    params = {
        page: 1
    }

    componentDidMount(){
        this.request();
    }

    // 动态获取mock数据
    request = () => {
        axios.ajax({
            url: '/table/high/list',
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
                    dataSource: res.result.list
                })
            }
        })
    }

    handleChange = (pagination, filters, sorter) => {
        console.log("::"+sorter)
        this.setState({
            sortOrder: sorter.order
        })
    }

    handleDelete = (item) =>{
        let id = item.id;
        Modal.confirm({
            title: '确认',
            content: '您确认要删除此条'+id+'数据吗？',
            onOk: ()=>{
                message.success('删除成功');
                this.request();
            }
        })
    }

    render(){
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                width: 80,
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                width: 80,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render (sex){
                    return sex === 1 ? '男': '女'
                },
                width: 80,
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
                },
                width: 80,
            },
            {
                title: '爱好',
                dataIndex: 'interest',
                render (interest){
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
                    return config[interest]
                },
                width: 80,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '地址',
                dataIndex: 'address',
                width: 120,
            },
            {
                title: '早起时间',
                dataIndex: 'time',
                width: 80,
            }
        ]

        const columns2 = [
            {
                title: '序号',
                dataIndex: 'id',
                fixed: 'left',
                width: 50,
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                fixed: 'left',
                width: 80,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render (sex){
                    return sex === 1 ? '男': '女'
                },
                width: 80,
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
                },
                width: 80,
            },
            {
                title: '爱好',
                dataIndex: 'interest',
                render (interest){
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
                    return config[interest]
                },
                width: 80,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '地址',
                dataIndex: 'address',
                width: 200,
            },
            {
                title: '早起时间',
                dataIndex: 'time',
                width: 80,
                fixed: 'right'
            }
        ]
    
        const columns3 = [
            {
                title: '序号',
                dataIndex: 'id',
                width: 50,
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                width: 80,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render (sex){
                    return sex === 1 ? '男': '女'
                },
                width: 80,
            },
            {
                title: '年龄',
                dataIndex: 'age',
                width: 80,
                sorter: (a, b)=>{
                    return a.age - b.age;
                },
                sortOrder: this.state.sortOrder
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
                },
                width: 80,
            },
            {
                title: '爱好',
                dataIndex: 'interest',
                render (interest){
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
                    return config[interest]
                },
                width: 80,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '地址',
                dataIndex: 'address',
                width: 120,
            },
            {
                title: '早起时间',
                dataIndex: 'time',
                width: 80,
            }
        ]

        const columns4 = [
            {
                title: '序号',
                dataIndex: 'id',
                width: 80,
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                width: 80,
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render (sex){
                    return sex === 1 ? '男': '女'
                },
                width: 80,
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
                },
                width: 80,
            },
            {
                title: '爱好',
                dataIndex: 'interest',
                render (interest){
                    let config = {
                        "1": <Badge status="success" text="篮球"/>,
                        "2": <Badge status="error" text="游泳"/>,
                        "3": <Badge status="default" text="美食"/>,
                        "4": <Badge status="processing" text="登山"/>,
                        "5": <Badge status="warning" text="健身"/>,
                        "6":'摄影',
                        "7":'美食',
                        "8":'唱歌',
                        "9":'绘画',
                        "10":'下棋',
                        "11":'游戏',
                        "12":'社交'
                    }
                    return config[interest]
                },
                width: 80,
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                width: 120,
            },
            {
                title: '地址',
                dataIndex: 'address',
                width: 120,
            },
            {
                title: '操作',
                render: (text, item) => {
                    return <Button size="small" onClick={(item) => {this.handleDelete(item)}}>删除</Button>
                },
                width: 80,
            }
        ]
        return (
            <div>
                <Card title="头部固定">
                    <Table
                        bordered
                        columns = {columns}
                        dataSource = {this.state.dataSource}
                        pagination = {false}
                        scroll={{y: 240}}
                    >
                    </Table>
                </Card>
                <Card title="左侧固定" style={{ margin: '10px 0'}}>
                    <Table
                        bordered
                        columns = {columns2}
                        dataSource = {this.state.dataSource}
                        pagination = {false}
                        scroll={{x: 1500}}
                    >
                    </Table>
                </Card>
                <Card title="表格排序" style={{ margin: '10px 0'}}>
                    <Table
                        bordered
                        columns = {columns3}
                        dataSource = {this.state.dataSource}
                        pagination = {false}
                        onChange={this.handleChange}
                    >
                    </Table>
                </Card>
                <Card title="操作按钮" style={{ margin: '10px 0'}}>
                    <Table
                        bordered
                        columns = {columns4}
                        dataSource = {this.state.dataSource}
                        pagination = {false}
                    >
                    </Table>
                </Card>
            </div>
        )
    }
}