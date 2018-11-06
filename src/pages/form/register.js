import React from "react";
import moment from 'moment';
import { Card, Form, Input, Button, Checkbox, Radio, Select, Switch, DatePicker, TimePicker, Upload, Icon, InputNumber, message} from "antd";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }
  

class FormRegister extends React.Component{

    state = {}

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                console.log(JSON.stringify(values))
            }
        });
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl => this.setState({
            userImg: imageUrl,
            loading: false,
          }));
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;  //解构赋值
        const formItemLayout = {
            labelCol: {
                xs: 24,
                sm: {
                    span: 4
                },
            },
            wrapperCol:{
                xs: 24,
                sm: {
                    span: 12
                },
            }
        }
        const offsetLayout = {
            wrapperCol: {
                xs: 24,
                sm: {
                    span: 12,
                    offset: 4
                }
            }
        }
        const rowObject = {
            minRows: 4,
            maxRows: 6,
        }
        return (
            <div>
                <Card title="注册表单" className="card-wrap">
                    <Form layout="horizontal" onSubmit={this.handleSubmit}>
                        <FormItem label="用户名" {...formItemLayout}>
                            {
                                getFieldDecorator('userName',{
                                    initialValue: '',
                                    rules:[
                                        {
                                            required: true,
                                            message: '用户名不能为空'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入用户名"/>
                                )
                            } 
                        </FormItem>
                        <FormItem label="密码" {...formItemLayout}>
                            {
                                getFieldDecorator('userPwd',{
                                    initialValue: '',
                                    rules:[
                                        {
                                            required: true,
                                            message: '密码不能为空'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入密码" type="password"/>
                                )
                            }
                        </FormItem>
                        <FormItem label="性别" {...formItemLayout}>
                            {
                                getFieldDecorator('sex',{
                                    initialValue: '1'
                                })(
                                    <RadioGroup>
                                        <Radio value="1">男</Radio>
                                        <Radio value="2">女</Radio>
                                    </RadioGroup>
                                )
                            }
                        </FormItem>
                        <FormItem label="年龄" {...formItemLayout}>
                            {
                                getFieldDecorator('age',{
                                    initialValue: '18'
                                })(
                                    <InputNumber />
                                )
                            }
                        </FormItem>
                        <FormItem label="当前状态" {...formItemLayout}>
                            {
                                getFieldDecorator('state',{
                                    initialValue: '2'
                                })(
                                    <Select>
                                        <Option value="1">咸鱼一条</Option>
                                        <Option value="2">风华浪子</Option>
                                        <Option value="3">北大才子</Option>
                                        <Option value="4">淘宝UED</Option>
                                        <Option value="5">创业者</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="爱好" {...formItemLayout}>
                            {
                                getFieldDecorator('interest',{
                                    initialValue: ['3', '6']
                                })(
                                    <Select mode="multiple">
                                        <Option value="1">篮球</Option>
                                        <Option value="2">游泳</Option>
                                        <Option value="3">美食</Option>
                                        <Option value="4">登山</Option>
                                        <Option value="5">健身</Option>
                                        <Option value="6">摄影</Option>
                                        <Option value="7">美食</Option>
                                        <Option value="8">唱歌</Option>
                                        <Option value="9">绘画</Option>
                                        <Option value="10">下棋</Option>
                                        <Option value="11">游戏</Option>
                                        <Option value="12">社交</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem label="是否已婚" {...formItemLayout}>
                            {
                                getFieldDecorator('isMarried',{
                                    valuePropName: 'checked',
                                    initialValue: false
                                })(
                                    <Switch></Switch>
                                )
                            }
                        </FormItem>
                        <FormItem label="生日" {...formItemLayout}>
                            {
                                getFieldDecorator('birthday',{
                                    initialValue: moment(new Date())
                                })(
                                    <DatePicker />
                                )
                            }
                        </FormItem>
                        <FormItem label="联系地址" {...formItemLayout}>
                            {
                                getFieldDecorator('address',{
                                    initialValue: '杭州市西湖区西园八路2号'
                                })(
                                    <TextArea 
                                        autosize = {rowObject}
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="早起时间" {...formItemLayout}>
                            {
                                getFieldDecorator('time',{
                                    initialValue: moment(new Date())
                                })(
                                    <TimePicker 
                                        format="HH:mm"
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem label="头像" {...formItemLayout}>
                            {
                                getFieldDecorator('userImg')(
                                    <Upload
                                        listType = "picture-card"
                                        showUploadList = {false}
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        beforeUpload={beforeUpload}
                                        onChange = {this.handleChange}
                                    >
                                        {this.state.userImg?<img src={this.state.userImg} alt="" />:<Icon type="plus" />}
                                    </Upload>
                                )
                            }
                        </FormItem>
                        <FormItem {...offsetLayout}>
                            {
                                getFieldDecorator('isRead')(
                                    <Checkbox>我已阅读过<a href="">协议</a></Checkbox>
                                )
                            }
                        </FormItem>
                        <FormItem {...offsetLayout}>
                            <Button type="primary" onClick={this.handleSubmit}>注册</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Form.create()(FormRegister);