import React from 'react'
import ReactEcharts from 'echarts-for-react'
import echartThemeLight from '../echartTheme'
// 按需加载
import echarts from 'echarts/lib/echarts'
// 导入折线图
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
export default class Line extends React.Component{

    componentWillMount(){
        echarts.registerTheme('JTbao', echartThemeLight)
    }

    getOption(todayData,yesterdayData) {
        let option = {
            tooltip: {
                trigger: 'axis',
            },
            legend:{
                data: ['今日', '昨日']
            },
            xAxis: {
                data: ['0时', '2时', '4时', '6时', '8时', '10时', '12时', '14时', '16时', '18时', '20时', '22时'],
                splitLine: {show: false},
                axisTick: {show: false}
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle:{
                        color: "#333f55"
                    }
                },
                axisLine: {show: false},
                axisTick: {show: false}
            },
            series: [
                {
                    name: '今日',
                    type: 'line',
                    smooth: true, //是否平滑曲线显示
                    data: todayData,
                    symbol: 'circle',
                    itemStyle: {
                        color: '#1bcf39'
                    }
                },
                {
                    name: '昨日',
                    type: 'line',
                    smooth: true, //是否平滑曲线显示
                    data: yesterdayData,
                    symbol: 'circle',
                    itemStyle: {
                        color: '#1e6adb'
                    }
                }
            ]
        }
        return option
    }

    render() {
        let {todayData, yesterdayData} = this.props;
        return (
            <div>
                <ReactEcharts option={this.getOption(todayData, yesterdayData)} theme="JTbao" style={{ height: 183, top: 20}}/>
            </div>
        )
    }
}