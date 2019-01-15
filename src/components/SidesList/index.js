import React, { Component } from 'react'
import { Drawer} from 'antd';
import { TransitionGroup, CSSTransition} from 'react-transition-group';
import { connect } from 'react-redux'
import { changeActiveId } from './../../redux/action'
import './index.less'

class SidesList extends Component {

    state = {
        todayData: []
    }

    showDetail = (item, index) => {
        let id = `${item.id}${item.type}`
        let todayData = this.state.todayData
        todayData[index].isRead = '1'
        const { dispatch } = this.props;
        dispatch(changeActiveId(id))
        this.setState({
            todayData
        })
        this.props.showDetailCallback(item)
    }

    componentWillReceiveProps = (nextProps) => {
        let {data, addData} = nextProps;
        this.setState({
            todayData: data
        })
        if(addData.length > 0){
            let data = addData.concat(this.state.todayData)
            this.setState({
                todayData: data
            })
        }
    }

    render() {
        let {todayData} = this.state;
        const levelArray = ['低', '中', '高']
        const renderTabs = () => {
            return todayData.map((item, index) => {
                let id = `${item.id}${item.type}`
                return (
                    <CSSTransition
                        timeout={300}
                        classNames="fade"
                        key= {`list${id}${item.state}`}
                    >
                        <li className={id === this.props.activeId ? 'list-item active': 'list-item'}>
                            <div className="info-item" onClick={() => this.showDetail(item, index)}>
                                <div className="left-wrap">
                                    {item.isRead === '0'? <div className="red-point"></div>: ''}
                                </div>
                                <div className="right-wrap">
                                    <div className="info-text name"><div className={"icon-type-"+item.type}></div>{item.typeName}</div>
                                    <div className="info-text">{item.time}</div>
                                    <div className="info-text">{item.address? item.address: '未知地址'}</div>
                                    <div className="info-text">{item.remark}</div>
                                    <div className="info-text">上报人：{item.realName}<span className="level">严重程度：{levelArray[item.severity]}</span></div>
                                </div>
                                <div className={"icon-level-"+item.state}></div>
                            </div>
                        </li>
                    </CSSTransition>
                );
            })
        }

        return (
            <Drawer
                placement='left'
                mask={false}
                maskClosable={false}
                closable={false}
                visible={this.props.visible}
                width={253}
                className="info-drawer"
            >
                <TransitionGroup
                    component="ul"
                >
                    {renderTabs()}
                </TransitionGroup>
            </Drawer>
        )
    }
}

const mapStateToProps = state => {
    return {activeId: state.activeId}
};

export default connect(mapStateToProps)(SidesList)