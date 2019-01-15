import React, { Component} from 'react'
import CountUp from 'react-countup';
import { Drawer } from 'antd';
import Line from '../../pages/charts/line'
import Pie from '../../pages/charts/pie'
import './index.less'

class FooterCharts extends Component {
    closeDrawer = () => {
        this.props.closeCallback(false)
    }

    render() {
        let {data, chartData} = this.props;
        let totalCount = data.todayCongestionCount + data.todayConstructionCount + data.todayWaterCount + data.todayDangerousCount + data.todayAccidentCount + data.todayElseCont + data.todayEquipmentCount + data.todayInstallationCount
        let abnormalCount = data.todayCongestionCount + data.todayConstructionCount + data.todayWaterCount + data.todayDangerousCount
        let eventCount= data.todayAccidentCount + data.todayElseCont
        let malfunctionCount = data.todayEquipmentCount + data.todayInstallationCount
        let PieArray = [abnormalCount,eventCount,malfunctionCount]
        const domFun = (value) => {
            let gmvDom = "";
            let gmv = [];
            gmv = value.toString().split("");
            let dataNum = gmv.length;
            if(dataNum === 3){
                gmvDom += '<div class="num-item">0</div>';
            }else if(dataNum === 2){
                gmvDom += '<div class="num-item">0</div><div class="num-item">0</div>';
            }else if(dataNum === 1){
                gmvDom += '<div class="num-item">0</div><div class="num-item">0</div><div class="num-item">0</div>';
            }
            gmv.forEach(function (item,index) {
                if (item.match('^[0-9]*$')){
                    gmvDom += '<div class="num-item">' + item + '</div>';
                }else{
                    gmvDom += item;
                }
            });
            return gmvDom;
        }
        return (
            <Drawer
                placement='bottom'
                mask={false}
                maskClosable={false}
                closable={false}
                visible={this.props.visible}
                height={211}
                className="chart-drawer"
            >
                <div className="left-warp">
                    <div className="today-title">
                        <div className="today-title-text" onClick={this.closeDrawer}>今日上报</div>
                        <div className="today-title-picker">
                            <CountUp className="num-box" start={0} end={totalCount||0} duration={3} formattingFn={domFun}/>
                        </div>
                    </div>
                    <div className="today-data">
                        <div className="today-data-row">
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayCongestionCount||0} duration={3}/>
                                <div className="item-title">拥堵</div>
                            </div>
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayConstructionCount||0} duration={3}/>
                                <div className="item-title">施工</div>
                            </div>
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayWaterCount||0} duration={3}/>
                                <div className="item-title">积水</div>
                            </div>
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayDangerousCount||0} duration={3}/>
                                <div className="item-title">危险</div>
                            </div>
                        </div>
                        <div className="today-data-row">
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayAccidentCount||0} duration={3}/>
                                <div className="item-title">事故</div>
                            </div>
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayElseCont||0} duration={3}/>
                                <div className="item-title">其他</div>
                            </div>
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayEquipmentCount||0} duration={3}/>
                                <div className="item-title">设备</div>
                            </div>
                            <div className="today-data-item">
                                <CountUp className="item-num-box" start={0} end={data.todayInstallationCount||0} duration={3}/>
                                <div className="item-title">设施</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="center-warp">
                    <div className="chart-title">
                        <span className="chart-title-text">今日上报趋势图</span><span className="chart-subtitle-text">today's report proportion</span>
                    </div>
                    <Line todayData={chartData.todayList||[]} yesterdayData={chartData.yesterdayList||[]}></Line>
                </div>
                <div className="right-warp">
                    <div className="chart-title">
                        <span className="chart-title-text">今日上报比例图</span><span className="chart-subtitle-text">today's report trend</span>
                    </div>
                    <Pie data={PieArray}></Pie>
                </div>
            </Drawer>
        );
    }
}

export default FooterCharts

