import React from 'react';
import {Card, Button, Modal, Form, Input, Table, DatePicker, Divider ,message} from 'antd';
import axios from './../../../axios';
import BaseForm from './../../../components/BaseForm';
import moment from 'moment';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class User extends React.Component {
    state = {
        list: [],
        isVisible: false
    }
    params = {
        page: 1,
        pageSize: 10
    }

    formList = [
        {
            type: 'INPUT',
            label: '用户名',
            field: 'userName',
            placeholder: '请输入用户名称',
            width: 150
        },
        {
            type: 'INPUT',
            label: '角色',
            field: 'roleId',
            placeholder: '请输入用户名称',
            width: 150
        },
    ]
    
    componentDidMount() {
        this.requestList();
    }
    handleFilter = (params) => {
        this.params = params;
        this.requestList();
    }
    requestList = () => {
        axios.requestList(this, '/user/getUserList.sp', this.params, true)
    }

    // 功能区操作
    handleOperate = (type) => {
        let item = this.state.selectedItem;
        var _this = this;
        switch (type) {
            case 'create':
                this.setState({
                    type,
                    isVisible: true,
                    title: '创建员工',
                    userInfo: {}
                })
                break;
            case 'edit':
                if (!item) {
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
                if (!item) {
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
                if (!item) {
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
            url: type === 'create' ? '/user/add' : '/user/edit',
            data: {
                params: data
            }
        }).then((res) => {
            if (res.code === 0) {
                message.success(`员工创建成功`)
                this.setState({
                    isVisible: false
                })
                this.requestList();
            } else {
                message.error(`员工创建失败`)
            }
        })
    }

    // 删除员工操作
    handleDelete = (item) => {
        axios.ajax({
            url: '/user/delete',
            data: {
                params: {
                    id: item.id
                }
            }
        }).then((res) => {
            if (res.code === 0) {
                message.success(`编号为${item.id}号的员工删除成功`)
                this.setState({
                    isVisible: false
                })
                this.requestList();
            } else {
                message.error(`员工删除失败`)
            }
        })
    }

    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'userName'
            },
            {
                title: '姓名',
                dataIndex: 'realName'
            },
            {
                title: '单位',
                dataIndex: 'unitName'
            },
            {
                title: '部门',
                dataIndex: 'departmentName'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '身份',
                dataIndex: 'identityTypeName'
            },
            {
                title: '角色',
                dataIndex: 'roleName'
            },
            {
                title: '操作',
                key: 'action',
                width: 480,
                render: (text, record) => (
                  <span>
                    <Button type="primary" icon="edit" onClick={()=>this.handleOperate('edit', record)}>编辑</Button>
                    <Divider type="vertical" />
                    <Button type="danger" icon="delete" onClick={()=>this.handleOperate('delete', record)}>删除</Button>
                    <Divider type="vertical" />
                    <Button type="default" onClick={()=>this.handleOperate('reset', record)}>重置密码</Button>
                  </span>
                ),
            }
        ]

        let footer = {};
        if (this.state.type === 'detail') {
            footer = {
                footer: null
            }
        }
        return (
            <div className="user-tube">
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card className="operate-wrap">
                    {/* <Button type="primary" icon="plus" onClick={()=>this.handleOperate('create')}>添加</Button> */}
                    <Button type="primary" icon="plus" >添加</Button>
                </Card>
                <div className="content-wrap">
                    <Table
                        bordered = {false}
                        columns = {columns}
                        dataSource = {this.state.list}
                        pagination = {this.state.pagination}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => {
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    width={650}
                    {...footer}
                >
                    <UserForm type={this.state.type} userInfo={this.state.userInfo}
                              wrappedComponentRef={(inst) => this.userForm = inst}/>
                </Modal>
            </div>
        )
    }
}
export default User

class UserForm extends React.Component {

    render() {
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 20}
        }
        return (

            <Form layout="horizontal">
                <FormItem label="用户名" {...formItemLayout}>
                    {
                        type === 'detail' ? userInfo.username :
                            getFieldDecorator('user_name', {
                                initialValue: userInfo.username
                            })(
                                <Input type="text" placeholder="请输入用户名"/>
                            )
                    }
                </FormItem>
                {/*<FormItem label="性别" {...formItemLayout}>*/}
                    {/*{*/}
                        {/*type === 'detail' ? (userInfo.sex === 1 ? '男' : '女') :*/}
                            {/*getFieldDecorator('sex', {*/}
                                {/*initialValue: userInfo.sex*/}
                            {/*})(*/}
                                {/*<RadioGroup>*/}
                                    {/*<Radio value={1} checked={true}>男</Radio>*/}
                                    {/*<Radio value={2}>女</Radio>*/}
                                {/*</RadioGroup>*/}
                            {/*)*/}
                    {/*}*/}
                {/*</FormItem>*/}
                {/*<FormItem label="状态" {...formItemLayout}>*/}
                    {/*{*/}
                        {/*type === 'detail' ? this.getState(userInfo.state) :*/}
                            {/*getFieldDecorator('state', {*/}
                                {/*initialValue: userInfo.state*/}
                            {/*})(*/}
                                {/*<Select placeholder="请选择状态">*/}
                                    {/*<Option value={1}>咸鱼一条</Option>*/}
                                    {/*<Option value={2}>风华浪子</Option>*/}
                                    {/*<Option value={3}>北大才子</Option>*/}
                                    {/*<Option value={4}>百度屌丝</Option>*/}
                                    {/*<Option value={5}>创业精英</Option>*/}
                                {/*</Select>*/}
                            {/*)*/}
                    {/*}*/}
                {/*</FormItem>*/}
                <FormItem label="生日" {...formItemLayout}>
                    {
                        type === 'detail' ? userInfo.birthday :
                            getFieldDecorator('birthday', {
                                initialValue: moment(userInfo.birthday)
                            })(
                                <DatePicker placeholder="请选择生日"/>
                            )
                    }
                </FormItem>
                <FormItem label="地址" {...formItemLayout}>
                    {
                        type === 'detail' ? userInfo.address :
                            getFieldDecorator('address', {
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