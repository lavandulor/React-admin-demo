import React from "react";
import { Card, Form, Input, Button, Icon, Checkbox, message} from "antd";
const FormItem = Form.Item;
class FormLogin extends React.Component{

    handleSubmit = (e) => {
        e.preventDefault();
        let userInfo = this.props.form.getFieldsValue();
        console.log(userInfo);
        this.props.form.validateFields((err, values) => {
          if (!err) {
            message.success(`${values.userName} 恭喜您通过本次登陆校验，您的登陆密码为 ${values.userPwd}`)
          }
        });
      }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Card title="登陆行内表单" className="card-wrap" style={{marginBottom: 10}}>
                    <Form layout="inline">
                        <FormItem>
                            <Input placeholder="请输入用户名"/>
                        </FormItem>
                        <FormItem>
                            <Input placeholder="请输入密码" type="password"/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary">登陆</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Card title="登陆水平表单" className="card-wrap">
                    <Form layout="horizontal" style={{width: 300}} onSubmit={this.handleSubmit}>
                        <FormItem>
                            {
                                getFieldDecorator('userName',{
                                    initialValue: '',
                                    rules:[
                                        {
                                            required: true,
                                            message: '用户名不能为空'
                                        },
                                        {
                                            min: 5,
                                            max: 10,
                                            message: '长度不在范围内'
                                        },
                                        {
                                            pattern: new RegExp('^\\w+$','g'),
                                            message: '用户名必须是字母或者数字'
                                        },
                                    ]
                                })(
                                    <Input prefix={<Icon type="user"></Icon>} placeholder="请输入用户名"/>
                                )
                            } 
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('userPwd',{
                                    initialValue: '',
                                    rules:[
                                        {
                                            required: true,
                                            message: '密码不能为空'
                                        },
                                        {
                                            min: 5,
                                            max: 10,
                                            message: '长度不在范围内'
                                        },
                                        {
                                            pattern: /^\w+$/ig,
                                            message: '密码必须是字母或者数字'
                                        },
                                    ]
                                })(
                                    <Input prefix={<Icon type="lock"></Icon>} placeholder="请输入密码" type="password"/>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('remember',{
                                    valuePropName: 'checked',
                                    initialValue: true
                                })(
                                    <Checkbox>记住密码</Checkbox>
                                )
                            }
                            <a href="" style={{float: 'right'}}>忘记密码</a>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" style={{width: '100%'}}>登陆</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Form.create()(FormLogin);