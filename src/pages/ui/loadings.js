import React from 'react'
import {Card, Icon, Spin, Alert} from 'antd'
import './ui.less'

export default class Loadings extends React.Component{

    render(){
        const icon = <Icon type="loading" style={{fontSize: 24}}/>
        const iconLoading = <Icon type="loading" style={{fontSize: 24}}/>
        return(
            <div>
                <Card title="Spin用法" className="card-wrap">
                    <Spin size="small"/>
                    <Spin style={{margin: '0 10px'}}/>
                    <Spin size="large"/>
                    <Spin indicator={icon} style={{marginLeft: 10}} spinning={true}/>
                </Card>
                <Card title="内容遮罩" className="card-wrap">
                    <Alert 
                        message="Raect"
                        description="欢迎学习React高级课程"
                        type="info"
                    />
                    <Spin>
                        <Alert 
                            message="Raect"
                            description="欢迎学习React高级课程"
                            type="warning"
                        />
                    </Spin>
                    <Spin tip="加载中...">
                        <Alert 
                            message="Raect"
                            description="欢迎学习React高级课程"
                            type="warning"
                        />
                    </Spin>
                    <Spin indicator={iconLoading} tip="加载中...">
                        <Alert 
                            message="Raect"
                            description="欢迎学习React高级课程"
                            type="warning"
                        />
                    </Spin>
                </Card>
            </div>
        )        
    }
}