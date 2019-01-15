import React from 'react'
import { Row, Col, Icon, Divider} from 'antd'
import { Redirect } from 'react-router-dom'
import './index.less'
import Util from '../../utils/utils'
import axios from '../../axios/index'
import NavTop from '../NavTop/index'
import { connect } from 'react-redux'
import LogoImage from '../../images/homePage/logo.png'
import UserImage from '../../images/homePage/icon_username.png'

class Header extends React.Component{
    state = {}
    componentWillMount() {
        let  isAuthenticated =  sessionStorage.getItem("admin_user") ? true :false;
        this.setState({isAuthenticated:isAuthenticated})
        if(!isAuthenticated){
            this.loginOut();
        }else{
            var user = JSON.parse(sessionStorage.getItem('admin_user'))
            this.setState({
                userName: user.userName,
                unitName: user.unitName
            })
        }

        this.timeInterval = setInterval(()=>{
            let sysTime = Util.formateDate(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000)
        
        // this.getWeatherAPIData()
    }

    loginOut() {
        sessionStorage.removeItem('admin_user')
        this.setState({
            redirect: true
        });
    }

    componentWillUnmount(){
        clearInterval(this.timeInterval)
    }

    getWeatherAPIData(){
        let city = '杭州';
        axios.jsonp({
            url:'http://api.map.baidu.com/telematics/v3/weather?location='+encodeURIComponent(city)+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        }).then((res)=>{
            if(res.status === 'success'){
                let data = res.results[0].weather_data[0];
                this.setState({
                    dayPictureUrl:data.dayPictureUrl,
                    weather:data.weather,
                    temperature: data.temperature
                })
            }
        })
    }

    render(){
        if (this.state.redirect) {
            return <Redirect push to="/login" />; 
        }
        return (
            <div className="header">
                <Row className="header-top">                
                    <Col span={5} className="logo">
                        <img src={LogoImage} alt="" />
                        <span>主动勤务后台管理系统</span>
                    </Col>
                    <Col span={14}>
                        <NavTop />
                    </Col>
                    <Col span={5} className="header-right">
                        <img src={UserImage} alt="" />
                        <span>{this.state.userName}&nbsp;&nbsp;单位：{this.state.unitName}</span>
                        <Divider type="vertical" />
                        <Icon type="poweroff" onClick={()=>this.loginOut()}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {menuName:state.menuName}
};

export default connect(mapStateToProps)(Header)