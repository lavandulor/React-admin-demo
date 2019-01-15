import React from 'react'
import { Row } from 'antd'
import Header from './components/Header'
import './style/common.less'

export default class Admin extends React.Component{

    render(){
        return (
            <div className="container">
                <Header />
                <Row className="main">
                    {this.props.children}
                </Row>
            </div>
        );
    }
}