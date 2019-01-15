import React, {Component} from 'react'
import MenuConfig from './../../config/menuConfig'
import { Menu } from 'antd'
import { NavLink } from 'react-router-dom'
import './index.less'

class Setting extends Component{
    state = {
        currentKey: '/setting/user'
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
        this.setState({
            currentKey: key
        })
    }

    // 菜单渲染 
    renderMenu = (data) => {
        return data.map((item) => {
            if(item.title === "系统设置"){
                return item.children.map((item) => {
                    return <Menu.Item title={item.title} key={item.key} >
                        <NavLink to={item.key}>{item.title}</NavLink>
                    </Menu.Item>
                })
            }
        })
    }
    render(){
        return (
            <div>
                <div className="setting-menu">
                    <Menu 
                        onClick={this.handleClick}
                        selectedKeys= {[this.state.currentKey]}
                        mode="horizontal"
                        >
                        { this.state.menuTreeNode }
                    </Menu>
                </div>
                <div className="setting-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Setting