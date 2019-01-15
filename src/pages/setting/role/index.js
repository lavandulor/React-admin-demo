import React from 'react';
import {Card, Button, Modal, Form, Input , Select, Tree, Transfer, TreeSelect} from 'antd';
import axios from './../../../axios';
import Utils from './../../../utils/utils';
import ETable from './../../../components/ETable';
import menuConfig from './../../../config/menuConfig';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class Role extends React.Component{
    
    state = {
        list: []
    }

    params = {
        page: 1,
        pageSize: 10
    }

    componentWillMount() {
        this.requestList()
        this.getFunctionMenu()
    }

    requestList  = () => {
        axios.requestList(this, '/user/getRoleList.sp', this.params, true)
    }

    // 角色创建
    handleRole = ()=>{
        this.setState({
            isRoleVisible:true
        })
    }

    // 角色提交
    handleRoleSubmit = ()=>{
        let data = this.roleForm.props.form.getFieldsValue();
        axios.ajax({
            url:'role/create',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isRoleVisible:false
                })
                this.requestList();
            }
        })
    }

    // 权限设置
    handlePermission = ()=> {
        let item = this.state.selectedItem;
        console.log(item)
        if(!item){
            Modal.info({
                title: '提示',
                content: '请选择一个角色'
            })
            return;
        }
        this.setState({
            isPermVisible: true,
            detailInfo: item,
            menuInfo: item.menu
        })
    }

    getFunctionMenu = ()=> {
        axios.ajax({
            url: '/user/getFunctionList.sp',
            data: {
                params:{}
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    functionMenu: res.data
                })
            }
        })
    }

    // 权限提交
    handlePermEditSubmit = () => {
        let data = this.permEditForm.props.form.getFieldsValue();
        data.role_id = this.state.selectedItem.id;
        data.menus = this.state.menuInfo;
        axios.ajax({
            url: 'permission/edit',
            data: {
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isPermVisible: false
                })
                this.requestList()
            }
        })
    }

    // 用户授权
    handleUserAuth = () => {
        let item = this.state.selectedItem;
        if(!item){
            Modal.info({
                title: '提示',
                content: '请选择一个角色'
            })
            return;
        }
        this.setState({
            isUserVisible: true,
            detailInfo: item
        })
        this.getRoleUserList(item.id);
    }

    // 获取角色下用户
    getRoleUserList = (id) => {
        axios.ajax({
            url: '/role/user_list',
            data: {
                params: {
                    id
                }
            }
        }).then((res) => {
            if(res){
                this.getAuthUserList(res.result);
            }
        })
    }

    // 筛选目标用户
    getAuthUserList = (dataSource) => {
        const mockData = [];
        const targetKeys = [];
        if(dataSource && dataSource.length > 0){
            for(let i = 0; i < dataSource.length; i++){
                const data = {
                    key: dataSource[i].user_id,
                    title: dataSource[i].user_name,
                    status: dataSource[i].status
                }
                if(data.status === 1){
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
            this.setState({
                mockData,
                targetKeys
            })
        }
    }

    // 用户授权提交
    handleUserSubmit = () => {
        let data = {}
        data.user_ids = this.state.targetKeys;
        data.role_id = this.state.selectedItem.id;
        axios.ajax({
            url: '/role/user_role_edit',
            data:{
                params: {...data}
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isUserVisible: false
                })
                this.requestList();
            }
        })
    }

    render(){
        const columns = [
            {
                title: '角色ID',
                dataIndex: 'id',
            },
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'time'
            },
            {
                title: '修改时间',
                dataIndex: 'authorize_time'
            },
            {
                title: '修改人',
                dataIndex: 'authorize_user_name'
            }
        ]
        return (
            <div>
                <Card className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" icon="edit" onClick={this.handlePermission}>设置权限</Button>
                    <Button type="primary" icon="info" onClick={this.handleUserAuth}>用户授权</Button>
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
                    title="创建角色"
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={()=>{
                        this.roleForm.props.form.resetFields();
                        this.setState({
                            isRoleVisible: false
                        })
                    }}
                >
                    <RoleForm 
                        functionMenu = {this.state.functionMenu}
                        wrappedComponentRef={(inst) => this.roleForm = inst}
                    >
                    </RoleForm>
                </Modal>
                <Modal
                    title="设置权限"
                    visible= {this.state.isPermVisible}
                    width={600}
                    onOk={this.handlePermEditSubmit}
                    onCancel={()=>{
                        this.setState({
                            isPermVisible: false
                        })
                    }}
                >
                    <PermEditForm 
                        wrappedComponentRef={(inst) => this.permEditForm = inst}
                        detailInfo={this.state.detailInfo}
                        menuInfo={this.state.menuInfo}
                        patchMenuInfo= {(checkedkeys)=>{
                            this.setState({
                                menuInfo: checkedkeys
                            })
                        }}
                    />
                </Modal>
                <Modal
                    title="用户授权"
                    visible= {this.state.isUserVisible}
                    width={800}
                    onOk={this.handleUserSubmit}
                    onCancel={()=>{
                        this.setState({
                            isUserVisible: false
                        })
                    }}
                >
                    <RoleAuthForm 
                        wrappedComponentRef={(inst) => this.userAuthForm = inst}
                        detailInfo={this.state.detailInfo}
                        targetKeys={this.state.targetKeys}
                        mockData={this.state.mockData}
                        patchUserInfo={(targetKeys)=>{
                            this.setState({
                                targetKeys
                            })
                        }}
                    />
                </Modal>
            </div>
        )
    }
}

export default Role

// 角色创建
class RoleForm extends React.Component{

    render() {
        const { functionMenu } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        const treeProps = {
            treeData: functionMenu,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请选择角色功能',
        };
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name', {
                            initialValue: ''
                        })(
                            <Input type="text" placeholder="请输入角色名称" />
                        )
                    }
                </FormItem>
                <FormItem label="功能" {...formItemLayout}>
                    {
                        getFieldDecorator('function', {
                            initialValue: []
                        })(
                            <TreeSelect {...treeProps}/>
                        )
                    }
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {
                        getFieldDecorator('remark', {
                            initialValue: ''
                        })(
                            <Input type="text" placeholder="请输入角色备注" />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
RoleForm = Form.create({})(RoleForm);

// 权限编辑
class PermEditForm extends React.Component{

    onCheck = (checkedkeys) => {
        this.props.patchMenuInfo(checkedkeys)
    }

    renderTreeNode = (data) => {
        return data.map((item) => {
            if(item.children) {
                return <TreeNode title={item.title} key={item.key}>
                    {this.renderTreeNode(item.children)}
                </TreeNode>
            }else{
                return <TreeNode {...item}/>
            }
        })
    }

    render(){
        const { getFieldDecorator } =  this.props.form;
        const detail_info = this.props.detailInfo;
        const menuInfo = this.props.menuInfo;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return(
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.name}/>
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue: detail_info.status
                        })(
                            <Select>
                                <Option value={1}>启用</Option>
                                <Option value={0}>停用</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={(checkedKeys)=>{
                        this.onCheck(checkedKeys);
                    }}
                    checkedKeys= {menuInfo}
                >
                    <TreeNode title="平台权限" key="platform_all">
                        {this.renderTreeNode(menuConfig)}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}
PermEditForm = Form.create({})(PermEditForm);

// 用户角色

class RoleAuthForm extends React.Component{

    onCheck = (checkedkeys) => {
        this.props.patchMenuInfo(checkedkeys)
    }

    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1
    }

    handleChange = (targetKeys) => {
        this.props.patchUserInfo(targetKeys)
    }

    render(){
        const detail_info = this.props.detailInfo;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return(
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.role_name}/>
                </FormItem>
                <FormItem label="选择用户" {...formItemLayout}>
                    <Transfer
                        listStyle={{width: 200,height: 400}}
                        dataSource={this.props.mockData}
                        titles={['待选用户', '已选用户']}
                        showSearch
                        searchPlaceholder='输入用户名'
                        filterOption= {this.filterOption}
                        targetKeys={this.props.targetKeys}
                        onChange={this.handleChange}
                        render={item=>item.title}
                    />
                </FormItem>
            </Form>
        )
    }
}

RoleAuthForm = Form.create({})(RoleAuthForm);