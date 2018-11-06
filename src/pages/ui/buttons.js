import React from 'react'
import {Card, Button, Icon, Radio} from 'antd'
import './ui.less'

export default class Buttons extends React.Component {

    state = {
        loading: true
    }

    handleCloseLoading = () => {
        this.setState({
            loading: false
        })
    }

    handleChange = (e) => {
        this.setState({
            size: e.target.value
        })
    }

    render() {
        return (
            <div>
                <Card title="基础按钮">
                    <Button type="primary">Primary</Button>
                    <Button>Default</Button>
                    <Button type="dashed">Dashed</Button>
                    <Button type="danger">Danger</Button>
                    <Button disabled>Disabled</Button>
                </Card>
                <Card title="图形按钮">
                    <Button icon="plus">创建</Button>
                    <Button icon="edit">编辑</Button>
                    <Button type="danger" icon="delete">删除</Button>
                    <Button shape="circle" icon="search"/>
                    <Button type="primary" icon="search">搜索</Button>
                    <Button type="primary" icon="download">下载</Button>
                </Card>
                <Card title="Loading按钮">
                    <Button type="primary" icon="edit" loading={this.state.loading}>确定</Button>
                    <Button type="primary" icon="plus" shape="circle" loading={this.state.loading}></Button>
                    <Button icon="download" loading={this.state.loading}>点击加载</Button>
                    <Button icon="search" shape="circle" loading={this.state.loading}/>
                    <Button type="primary" onClick={this.handleCloseLoading}>关闭</Button>
                </Card>
                <Card title="按钮组">
                    <Button.Group>
                        <Button type="primary"><Icon type="left" />返回</Button>
                        <Button type="primary">前进<Icon type="right" /></Button>
                    </Button.Group>
                </Card>
                <Card title="按钮尺寸">
                    <Radio.Group value={this.state.size} onChange={this.handleChange}>
                        <Radio value="small">小</Radio>
                        <Radio value="default">中</Radio>
                        <Radio value="large">大</Radio>
                    </Radio.Group>
                    <Button type="primary" size={this.state.size}>Primary</Button>
                    <Button size={this.state.size}>Default</Button>
                    <Button type="dashed" size={this.state.size}>Dashed</Button>
                    <Button type="danger" size={this.state.size}>Danger</Button>
                    <Button disabled size={this.state.size}>Disabled</Button>
                </Card>
            </div>
        )
    }
}