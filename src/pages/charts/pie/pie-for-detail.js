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
            backgroundColor: "rgba(255,255,255,0)",
            tooltip: {
                trigger: 'item',
                formatter: '{a}<br/>{b}:{c}({d}%)'
            },
            series: [
                {
                    name: '上报量',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    minAngle: '15',
                    startAngle: '130',
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
                    ],
                    labelLine: {
                        normal:{
                            lenght: 30,
                            lenght2: 20
                        }
                    },
                    label: {
                        normal: { //设置引线字体样式
                            formatter: '{b|{b}}\n{c|{c}}\n{d|{d}%}\n',
                            rich: {
                                b: {
                                    fontSize: 12,
                                    marginTop: 10,
                                    color: '#ffffff',
                                },
                                d: {
                                    fontSize: 12,
                                    marginBottom: 10,
                                    color: '#ffffff',
                                    backgroundColor: '#136163'
                                },
                                c: {
                                    fontSize: 18,
                                    padding: 2,
                                    color: '#eaac65',
                                }
                            }
                        }
                    }
                    
                }
            ]
        }
        return option
    }

    render() {
        let {data} = this.props
        return (
            <div style={{ height: '100%'}}>
                <ReactEcharts option={this.getOption(data)} theme="JTbao" style={{ height: '100%'}}/>
            </div>
        )
    }
}