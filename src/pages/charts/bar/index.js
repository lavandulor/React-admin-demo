import React from 'react'
import ReactEcharts from 'echarts-for-react'
import echartTheme from '../echartTheme'
// import echarts from 'echarts'
// 按需加载
import echarts from 'echarts/lib/echarts'
// 导入柱形图
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
export default class Bar extends React.Component{

    componentWillMount(){
        echarts.registerTheme('JTbao', echartTheme)
    }

    getOption(data) {
        let option ={
            backgroundColor: "rgba(255,255,255,0)",
            grid:{
                bottom: 30
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: ['拥堵', '施工', '积水', '危险', '事故', '其他', '设备', '设施'],
                splitLine: {show: false},
                axisTick: {show: false}
            },
            yAxis: {
                type: 'value',
                show: false,
                splitLine: {show: false},
                axisLine: {show: false},
                axisTick: {show: false}
            },
            series: [
                {
                    name: '上报量',
                    type: 'bar',
                    barWidth: '20%',
                    data: data,
                    itemStyle:{
                        color: '#1f73ec'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        distance: 10,
                        color: '#EAAC65',
                        fontSize: 14
                    }
                }
            ]
        }
        return option
    }

    render() {
        let {data} = this.props
        return (
            <div style={{height: '100%'}}>
                <ReactEcharts option={this.getOption(data)} theme="JTbao" style={{height: '100%'}}/>
            </div>
        )
    }
}