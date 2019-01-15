import React from 'react'
import ReactEcharts from 'echarts-for-react'
import echartThemeLight from '../echartTheme'
// import echarts from 'echarts'
// 按需加载
import echarts from 'echarts/lib/echarts'
// 导入饼图
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
export default class Pie extends React.Component{

    componentWillMount(){
        echarts.registerTheme('JTbao', echartThemeLight)
    }

    getOption(data) {
        let option = {
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: ['异常路况', '事件处理', '故障上报']
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a}<br/>{b}:{c}({d}%)'
            },
            series: [
                {
                    name: '上报量',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    startAngle: '150',
                    data: [
                        {
                            value: data[0],
                            name: '异常路况'
                        },
                        {
                            value: data[1],
                            name: '事件处理'
                        },
                        {
                            value: data[2],
                            name: '故障上报'
                        }
                    ]
                }
            ]
        }
        return option
    }

    render() {
        let {data} = this.props
        return (
            <div style={{width: '100%', height: 173,position: "absolute", top: 20}}>
                <ReactEcharts option={this.getOption(data)} theme="JTbao" style={{ height: 173}}/>
            </div>
        )
    }
}