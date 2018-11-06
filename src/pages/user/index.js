import React from 'react';
import {Card, Button, Modal, Form, Input, Radio, DatePicker, Select, message} from 'antd';
import axios from './../../axios';
import Utils from './../../utils/utils';
import BaseForm from './../../components/BaseForm';
import ETable from './../../components/ETable';
import moment from 'moment';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const Option = Select.Option;

export default class User extends React.Component{

    state = {
        list: [],
        isVisible: false
    }
    params = {
        page: 1,
    }

    formList = [
        {
            type: 'INPUT',
            label: '用户名',
            field: 'user_name',
            placeholder: '请输入用户名称',
            width: 150
        },
        {
            type: 'INPUT',
            label: '用户手机号',
            field: 'user_mobile',
            placeholder: '请输入用户手机号',
            width: 150
        },
        {
            type: 'DATE',
            label: '入职时间',
            field: 'user_date',
            placeholder: '请输入日期'
        }
    ]

    componentDidMount() {
        this.requestList();
    }

    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    }

    requestList  = () => {
        axios.requestList(this, '/user/list', this.params, true)
    }

    // 功能区操作
    handleOperate = (type) => {
        let item = this.state.selectedItem;
        var _this = this;
        switch(type){
            case 'create':
                this.setState({
                    type,
                    isVisible: true,
                    title: '创建员工',
                    userInfo: {}
                })
                break;
            case 'edit':
                if(!item){
                    Modal.info({
                        title: "提示",
                        content: '请选择一个员工' 
                    })
                    return;
                }
                this.setState({
                    type,
                    isVisible: true,
                    title: '编辑员工',
                    userInfo: item
                })
                break;
            case 'detail':
                if(!item){
                    Modal.info({
                        title: "提示",
                        content: '请选择一个员工' 
                    })
                    return;
                }
                this.setState({
                    type,
                    isVisible: true,
                    title: '员工详情',
                    userInfo: item
                })
                break;
            case 'delete':
                if(!item){
                    Modal.info({
                        title: "提示",
                        content: '请选择一个员工' 
                    })
                    return;
                }
                Modal.confirm({
                    title: '确认删除',
                    content: '是否要删除当前选中的员工',
                    onOk(){
                        _this.handleDelete(item)
                    }
                })
                break;            
            default:
                
                break;

        }
    }

    // 创建员工提交
    handleSubmit = () => {
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.ajax({
            url: type === 'create'?'/user/add':'/user/edit',
            data: {
                params: data
            }
        }).then((res)=>{
            if(res.code === 0){
                message.success(`员工创建成功`)
                this.setState({
                    isVisible: false
                })
                this.requestList();
            }else{
                message.error(`员工创建失败`)
            }
        })
    }

    // 删除员工操作
    handleDelete = (item) => {
        axios.ajax({
            url: '/user/delete',
            data: {
                params:{
                    id: item.id
                }
            }
        }).then((res)=>{
            if(res.code === 0){
                message.success(`编号为${item.id}号的员工删除成功`)
                this.setState({
                    isVisible: false
                })
                this.requestList();
            }else{
                message.error(`员工删除失败`)
            }
        })
    }

    render(){
        const columns = [
            {
                title: '编号',
                dataIndex: 'id'
            },
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render(sex) {
                    return sex === 1?'男':'女'
                }
            },
            {
                title: '状态',
                dataIndex: 'state',
                render(state){
                    return {
                        '1': '咸鱼一条',
                        '2': '风华浪子',
                        '3': '北大才子',
                        '4': '百度屌丝',
                        '5': '创业精英',
                    }[state]
                }
            },
            {
                title: '爱好',
                dataIndex: 'interest',
                render(interest){
                    return {
                        '1': '游泳',
                        '2': '打篮球',
                        '3': '踢足球',
                        '4': '跑步',
                        '5': '爬山',
                        '6': '骑行',
                        '7': '桌球',
                        '8': '麦霸'
                    }[interest]
                }
            },
            {
                title: '生日',
                dataIndex: 'birthday'
            },
            {
                title: '联系地址',
                dataIndex: 'address'
            },
            {
                title: '早起时间',
                dataIndex: 'time'
            }
        ]

        let footer = {};
        if(this.state.type === 'detail'){
            footer = {
                footer: null
            }
        }
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card style={{marginTop: 10}} className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={()=>this.handleOperate('create')}>创建员工</Button>
                    <Button type="primary" icon="edit" onClick={()=>this.handleOperate('edit')}>编辑员工</Button>
                    <Button type="primary" icon="info" onClick={()=>this.handleOperate('detail')}>员工详情</Button>
                    <Button type="danger" icon="delete" onClick={()=>this.handleOperate('delete')}>删除员工</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        updateSelectedItem = {Utils.updateSelectedItem.bind(this)} 
                        columns = {columns}
                        dataSource = {this.state.list}
                        selectedRowKeys = {this.state.selectedRowKeys}
                        selectedItem = {this.state.selectedItem}
                        pagination = {true}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    width={650}
                    {...footer}
                >
                    <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst)=>this.userForm = inst}/>
                </Modal>
            </div>
        )
    }
}

class UserForm extends React.Component{

    getState = (state) => {
        return {
            '1': '咸鱼一条',
            '2': '风华浪子',
            '3': '北大才子',
            '4': '百度屌丝',
            '5': '创业精英',
        }[state]
    }

    render(){
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span:4},
            wrapperCol: {span: 20}
        }
        return (

            <Form layout="horizontal">
                <FormItem label="用户名" {...formItemLayout}>
                    {
                        type === 'detail'?userInfo.username:
                            getFieldDecorator('user_name',{
                                initialValue: userInfo.username
                            })(
                                <Input type="text" placeholder="请输入用户名" />
                            )
                    }
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {
                        type === 'detail'? (userInfo.sex === 1?'男':'女'):
                            getFieldDecorator('sex',{
                                initialValue: userInfo.sex
                            })(
                                <RadioGroup>
                                    <Radio value={1} checked={true}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                </RadioGroup>
                            )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        type === 'detail'?this.getState(userInfo.state):
                            getFieldDecorator('state',{
                                initialValue: userInfo.state
                            })(
                                <Select placeholder="请选择状态">
                                    <Option value={1}>咸鱼一条</Option>
                                    <Option value={2}>风华浪子</Option>
                                    <Option value={3}>北大才子</Option>
                                    <Option value={4}>百度屌丝</Option>
                                    <Option value={5}>创业精英</Option>
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="生日" {...formItemLayout}>
                    {
                        type === 'detail'?userInfo.birthday:
                            getFieldDecorator('birthday',{
                                initialValue: moment(userInfo.birthday)
                            })(
                                <DatePicker placeholder="请选择生日"/>
                            )
                    }
                </FormItem>
                <FormItem label="地址" {...formItemLayout}>
                    {
                        type === 'detail'?userInfo.address:
                            getFieldDecorator('address',{
                                initialValue: userInfo.address
                            })(
                                <TextArea rows={3} placeholder="请输入联系地址"/>
                            )
                    }
                </FormItem>
            </Form>
        )
    }
}
UserForm = Form.create({})(UserForm);