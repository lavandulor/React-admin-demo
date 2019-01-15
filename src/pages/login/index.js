import React from 'react'
import {Form, Input, Button, Icon} from 'antd'
import { withRouter } from 'react-router-dom';
import MD5 from 'js-md5';
import axios from '../../axios/index'
import Footer from '../../components/Footer'
import './index.less'
const FormItem = Form.Item;

class Login extends React.Component {
    state = {};

    componentDidMount() {//每次进入登录页清除之前的登录信息
        sessionStorage.removeItem('admin_user');
        document.addEventListener("keydown",this.handleEnterKey);
    }

    componentWillUmount(){
        document.removeEventListener("keydown",this.handleEenterKey);
    }

    loginReq = (params) => {
        console.log(params)
        const userName = params.username;
        const userPwd = MD5(params.password);
        axios.ajax({
            url: '/user/login.np',
            data: {
                params: {
                    userName, userPwd
                }
            },
            method: 'POST',
        }).then((res) => {
            if(res.state === 0){
                console.log(res);
                if(res.data != null){
                    sessionStorage.setItem('admin_user', JSON.stringify(res.data));
                    this.props.history.push('/home');
                }
            }
        })
    };



    render() {
        return (
            <div className="login-page">
                <div className="login-header-wrap">主动勤务后台管理系统</div>
                <div className="login-content-wrap">
                    <div className="login-content">
                        <div className="image-box"></div>
                        <div className="login-box">
                            <div className="error-msg-wrap">
                                <div
                                    className={this.state.errorMsg?"show":""}>
                                    {this.state.errorMsg}
                                </div>
                            </div>
                            <div className="title">主动勤务后台管理系统</div>
                            <LoginForm ref="login" loginSubmit={this.loginReq} wrappedComponentRef={(inst) => this.roleForm = inst}/>
                        </div>
                    </div>
                    <div className="bottom-shadow-wrap">
                        <div className="shadow-box" style={{marginRight: 178, marginLeft: 100}}></div>
                        <div className="shadow-box" style={{marginLeft: 170}}></div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default withRouter(Login)

class LoginForm extends React.Component {
    state = {};

    componentDidMount() {
        document.addEventListener("keydown",this.handleEnterKey);
    }
    
    componentWillUmount(){
        document.removeEventListener("keydown",this.handleEenterKey);
    }

    loginSubmit = (e)=> {
        e && e.preventDefault();
        const _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var formValue = _this.props.form.getFieldsValue();
                _this.props.loginSubmit({
                    username: formValue.username,
                    password: formValue.password
                });
            }
        });
    };

    handleEnterKey = (e) => {
        if(e.keyCode === 13){
            this.loginSubmit()
        }
    }

    checkUsername = (rule, value, callback) => {
        var reg = /^\w+$/;
        if (!value) {
            callback('请输入用户名!');
        } else if (!reg.test(value)) {
            callback('用户名只允许输入英文字母');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            callback('请输入密码!');
        } else {
            callback();
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        initialValue:'',
                        rules: [{validator: this.checkUsername}]
                    })(
                        <Input style={{height: 47}} prefix={<Icon type="user" style={{fontSize: '20px', marginRight: 10}} />} placeholder="请输入账号"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        initialValue:'',
                        rules: [{validator: this.checkPassword}]
                    })(
                        <Input style={{height: 47}} type="password" prefix={<Icon type="lock" style={{fontSize: '20px', marginRight: 10}} />} placeholder="请输入密码"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.loginSubmit} className="login-form-button" style={{height: 50}}>登录</Button>
                </FormItem>
            </Form>
        )
    }
}

LoginForm = Form.create({})(LoginForm);
