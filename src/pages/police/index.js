import React from 'react';
import {Card, Row, Col, List, Avatar} from 'antd';
import { Redirect } from 'react-router-dom'
import CountUp from 'react-countup';
import BaseForm from './../../components/BaseForm';
import axios from './../../axios/index';
import './index.less'
const ListItem = List.Item;
const CardMeta = Card.Meta;
class Police extends React.Component {

    state = {
        list: [],
        isShowOpenCity: false,
        chartData: {},
        redirect: false
    }

    params = {
        page: 1,
        pageSize: 12
    }

    formList = [
        {
            type: 'INPUT',
            label: '警员姓名',
            field: 'police_name',
            placeholder: '请输入警员姓名',
            width: 200
        },
        {
            type: 'INPUT',
            label: '警号',
            field: 'police_code',
            placeholder: '请输入警号',
            width: 200
        }
    ]


    componentDidMount() {
        let width = document.querySelector('body').offsetWidth;
        if(width >= 1600){
            this.params.pageSize = 16;
        }else{
            this.params.pageSize = 12;
        }
        this.requestList();
        this.requestData();
    }

    // 默认请求接口数据
    requestList = () => {
        axios.requestList(this, '/user/getPoliceList.sp', this.params, true)
    }

    // 请求数据统计接口
    requestData =() => {
        let params = {}
        axios.ajax({
            url: '/statistics/getStatistics.sp',
            data:{
                params: params
            }
        }).then((res)=>{
            if(res.state === 0){
                console.log(res)
                this.setState({
                    chartData: res.data
                })
            }
        })
    }

    // 查询条件过滤
    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    }

    openPoliceDetail = (id) => {
        this.setState({
            redirect: true,
            policeId: id
        })
    }
    
    render() {
        if (this.state.redirect) {
            return <Redirect push to={`/common/police/detail/${this.state.policeId}`} />; 
        }
        return ( 
            <div className="police-wrap">
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card> 
                <Card className="police-data-wrap">
                    <Row type="horizontal">
                        <Col span="7" className="left-wrap">
                            <div className="police-count-icon"></div><span className="title">警员总数：</span><span className="num-wrap"><CountUp className="num" start={0} end={this.state.chartData.policeCount||0} duration={3}/>人</span>
                        </Col>
                        <Col span="7" className="left-wrap">
                            <div className="event-count-icon"></div><span className="title">上报总量：</span><span className="num-wrap"><CountUp className="num" start={0} end={this.state.chartData.totalCount||0} duration={3}/>宗</span>
                        </Col>
                        <Col span="10" className="center-wrap">
                            <Col className="item" span="8"><CountUp className="num color1" start={0} end={this.state.chartData.abnormalCount||0} duration={3}/><div className="title">异常路况</div></Col>
                            <Col className="item" span="8"><CountUp className="num color2" start={0} end={this.state.chartData.eventCount||0} duration={3}/><div className="title">事故处理</div></Col>
                            <Col className="item" span="8"><CountUp className="num color3" start={0} end={this.state.chartData.malfunctionCount||0} duration={3}/><div className="title">故障上报</div></Col>
                        </Col>
                    </Row>
                </Card>
                <div className="police-list-wrap">
                    <List
                        grid={{
                            gutter: 16, sm: 4, md: 4, lg: 4, xl: 6, xxl: 8,
                        }}
                        itemLayout="vertical"
                        size="large"
                        pagination={this.state.pagination}
                        dataSource={this.state.list}
                        locale={{emptyText: '数据加载中...'}}
                        renderItem={item => (
                            <ListItem>
                              <Card 
                                bordered={false}
                                hoverable={true}
                                cover={
                                    <div className="police-info">
                                        <div className="police-base-info">
                                            <Avatar className="police-photo" shape="square" src={item.photo?item.photo:"/assets/zhaopian.png"}/>
                                            <div className="police-name">
                                                <div>姓名：{item.realName}</div>
                                                <div className="level">警号：{item.policeNumber}</div>
                                                <div className="level">职务：{item.duty}</div>
                                            </div>
                                        </div>
                                        <div className="police-dept">辖区：{item.departmentName}</div>
                                    </div>
                                }
                                onClick={()=>this.openPoliceDetail(item.id)}
                                >
                                <CardMeta
                                    title={
                                        <div className="police-handle-num">
                                            <div className="title">上报总量</div>
                                            <div className="totalnum"><span>{item.abnormalCount+item.eventCount+item.malfunctionCount}</span> 个</div>
                                            <div className="medal gold-medal"></div>
                                        </div>
                                    }
                                    description={
                                        <div className="police-handle-class">
                                            <div className="item"><div className="num">{item.abnormalCount}</div><div className="item-class class1">异常路况</div></div>
                                            <div className="item"><div className="num">{item.eventCount}</div><div className="item-class class2">事件处理</div></div>
                                            <div className="item"><div className="num">{item.malfunctionCount}</div><div className="item-class class3">故障上报</div></div>
                                        </div>
                                    }
                                />
                              </Card>
                            </ListItem>
                        )}
                    />
                </div>
            </div>
        )
    }
}

export default Police
