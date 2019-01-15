import React from 'react'
import MenuConfig from './../../config/menuConfig'
import { Menu } from 'antd'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { switchMenu } from './../../redux/action'
import './index.less'

class NavTop extends React.Component{
    state = {
        currentKey: '/home'
    }

    componentWillMount() {
        const menuTreeNode = this.renderMenu(MenuConfig);
        let currentKey = window.location.hash.replace(/#|\?.*$/g, '')
        this.setState({
            menuTreeNode,
            currentKey
        })
    }

    handleClick = ({item, key}) => {
        if (key === this.state.currentKey) {
            return false;
        }
        const { dispatch } = this.props;
        dispatch(switchMenu(item.props.title))
        this.setState({
            currentKey: key
        })
    }

    // 菜单渲染 
    renderMenu = (data) => {
        return data.map((item) => {
            return <Menu.Item title={item.title} key={item.key} >
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }

    render(){
        return (
            <div className="menu-top">
                <Menu 
                    onClick={this.handleClick}
                    selectedKeys= {[this.state.currentKey]}
                    mode="horizontal"
                    theme="dark"
                    >
                    { this.state.menuTreeNode }
                </Menu>
            </div>
        );
    }
}

export default connect()(NavTop);