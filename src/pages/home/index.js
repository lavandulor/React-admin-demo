import React , {Component, Fragment}from 'react'
import {Button, Popover, Switch, Radio} from 'antd'
import axios from './../../axios'
import Utils from '../../utils/utils'
import FooterCharts from '../../components/FooterCharts'
import SidesList from '../../components/SidesList'
import IndexMap from '../map/indexMap'
import moment from 'moment'
import './index.less'

const RadioGroup = Radio.Group;
class Home extends Component{

    state = { 
        chartsVisible: true,
        infosVisible: true,
        detailVisible: false,
        detailID: 1,
        todayData: [],
        chartData: {},
        todayChartData: {},
        addData: [],
        mapMarkTypeValue: '',
        mapSourceTypeValue: '',
        showEventsMarker: true,
        showPoliceMarker: true,
        showSourceMarker: true,
        showAreaMarker: true
    };

    CHART_TIME = 2 * 60 * 60 * 1000;
    LIST_TIME = 30 * 1000;

    componentDidMount() {
        var _this = this;
        this.requestTodayData(this.state.mapMarkTypeValue);
        this.requestChart();
        this.requestTodayChart();
        this.ListInterval = setInterval(()=>{
            _this.requestTodayData(this.state.mapMarkTypeValue)
        }, this.LIST_TIME)
        this.DataInterval = setInterval(()=>{
            _this.requestTodayChart()
        }, this.LIST_TIME)
        this.ChartInterval = setInterval(()=>{
            _this.requestChart()
        }, this.CHART_TIME)
    }

    componentWillUnmount(){
        clearInterval(this.ListInterval)
        clearInterval(this.DataInterval)
        clearInterval(this.ChartInterval)
    }

    handleFeedback = () => {
        this.requestTodayData(this.state.mapMarkTypeValue);
    }

    requestTodayData = (type) => {
        let typeArray = Utils.formatQueryTypeForHome(type); // [queryType, concreteType]
        let params = {
            beginTime: moment().subtract(7, 'days').format("YYYY-MM-DD 00:00:00"),
            // beginTime: moment().format("YYYY-MM-DD 00:00:00"),
            endTime:  moment().format('YYYY-MM-DD 23:59:59'),
            page: 1,
            pageSize: 100,
            queryType: typeArray[0],
            concreteType: typeArray[1]
        }
        axios.ajax({
            url: '/service/getReportList.sp',
            data:{
                params: params,
                isShowLoading: false
            }
        }).then((res)=>{
            if(res.state === 0){
                this.setState({
                    todayData: res.data.item_list
                })
            }
        })
    }

    requestTodayChart = () => {
        let params = {}
        axios.ajax({
            url: '/statistics/getTodayReportStatistics.sp',
            data:{
                params: params,
                isShowLoading: false
            }
        }).then((res)=>{
            if(res.state === 0){
                this.setState({
                    todayChartData: res.data
                })
            }
        })
    }

    requestChart = () => {
        let params = {}
        axios.ajax({
            url: '/statistics/getReportStatistics.sp',
            data:{
                params: params,
                isShowLoading: false
            }
        }).then((res)=>{
            if(res.state === 0){
                this.setState({
                    chartData: res.data
                })
            }
        })
    }

    showChartsDrawer = () => {
      this.setState({
            chartsVisible: true,
      });
    };

    showInfoDrawer = () => {
        this.setState({
            infosVisible: true,
        });
    }

    closeCharts = (props) => {
        this.setState({
            chartsVisible: props,
        });
    }

    closeInfos = (props) => {
        this.setState({
            infosVisible: props,
        });
    }

    showDetail = (props) => {
        this.setState({
            clickData: props
        });
    }

    onTipChange = (type,e) => {
        switch (type) {
            case 'eventsAll':
                this.setState({
                    mapMarkTypeValue: '',
                    showEventsMarker: e
                })
                break;
            case 'eventsType':
                this.setState({
                    mapMarkTypeValue: e.target.value,
                })
                this.requestTodayData(e.target.value);
                break;
            case 'police':
                this.setState({
                    showPoliceMarker: e
                })    
                break;
            case 'sourceAll':
                this.setState({
                    showSourceMarker: e
                })
                break;
            case 'sourceType':
                this.setState({
                    mapSourceTypeValue: e.target.value
                })
                break; 
            case 'area':
                this.setState({
                    showAreaMarker: e
                })
                break;    
            default:
            break;    
        }
    }

    render(){
        const TipContent = (
            <div className="map-tip-content">
                <div className="map-tip-line">上报点位 <Switch defaultChecked onChange={(e) => this.onTipChange('eventsAll', e)} size="small"/></div>
                <RadioGroup onChange={(e) => this.onTipChange('eventsType',e)} value={this.state.mapMarkTypeValue}>
                    <Radio value={''}>全部</Radio>
                    <br />
                    <Radio value={'1'}>拥堵</Radio>
                    <Radio value={'2'}>施工</Radio>
                    <Radio value={'3'}>积水</Radio>
                    <Radio value={'4'}>危险</Radio>
                    <br />
                    <Radio value={'5'}>事故</Radio>
                    <Radio value={'6'}>其他</Radio>
                    <Radio value={'7'}>设备</Radio>
                    <Radio value={'8'}>设施</Radio>
                </RadioGroup>
                <div className="map-tip-line">人员点位 <Switch onChange={(e) => this.onTipChange('police', e)} size="small"/></div>
                <div className="map-tip-line">资源点位 <Switch onChange={(e) => this.onTipChange('sourceAll', e)} size="small"/></div>
                <RadioGroup onChange={(e) => this.onTipChange('sourceType', e)} value={this.state.mapSourceTypeValue}>
                    <Radio value={'1'}>超市</Radio>
                    <Radio value={'2'}>卫生间</Radio>
                    <Radio value={'3'}>加油站</Radio>
                    <Radio value={'4'}>公交站</Radio>
                </RadioGroup>
                <div className="map-tip-line">辖区 <Switch onChange={(e) => this.onTipChange('area', e)} size="small"/></div>
            </div>
        );

        return (
            <Fragment>
                <div className="home-wrap">
                    <IndexMap data={this.state.showEventsMarker?this.state.todayData:[]} clickData={this.state.clickData} handleFeedback={this.handleFeedback}/>
                </div>
                <SidesList 
                    visible={this.state.infosVisible} 
                    closeCallback={this.closeInfos} 
                    showDetailCallback={this.showDetail} 
                    data={this.state.todayData}
                    addData = {this.state.addData}
                />
                <Popover 
                    overlayClassName="map-tip-wrap"
                    placement="bottomRight" 
                    content={TipContent} 
                    trigger="click">
                    <Button className="map-tip-btn"></Button>
                </Popover>
                <Button type="primary" onClick={this.showChartsDrawer} className="charts-btn">今日数据</Button>
                <FooterCharts visible={this.state.chartsVisible} closeCallback={this.closeCharts} data={this.state.todayChartData} chartData={this.state.chartData}/>
            </Fragment>
        )
    }
}

export default Home