import React, { Component, Fragment} from 'react';
import {Button, Form, Radio, Upload, Icon, Input, message, TreeSelect, Select, Switch} from 'antd';
import LocationSelectModal from './../../components/LocationSelectModal'
import axios from './../../axios/index';
import Utils from './../../utils/utils';
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const TextArea = Input.TextArea;
const Option = Select.Option;

class EventForm extends Component{
    state = {
        isShowMapSelect: false,
        mapFormFields: {
            address: '',
            longitude: '',
            latitude: ''
        },
        fileList: [],
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        e.file.status = "done";
        return e && e.fileList;
    }
    handleMapOpen = () => {
        this.setState({
            isShowMapSelect: true
        })
    }
    handleMapClose = () => {
        this.setState({
            isShowMapSelect: false
        })
    }
    handleMapSubmit = (props)=>{
        console.log(props)
        this.setState({
            mapFormFields: props,
            isShowMapSelect: false
        })
        this.props.form.setFieldsValue({address: props.position, x: props.longitude,  y: props.latitude})
    }

    handleUpload = (file) => {
        console.log(file)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filePath', file.filePath)
        axios.fileUpload({
            url: '/system/uploadFiles.np',
            formData
        })
    }

    render(){
        const fromItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        }
        const { getFieldDecorator, getFieldValue} = this.props.form;
        const { isShowMapSelect } = this.state;
        const uploadProps =  {
            // onRemove: (file) => {
            //   this.setState(({ fileList }) => {
            //     const index = fileList.indexOf(file);
            //     const newFileList = fileList.slice();
            //     newFileList.splice(index, 1);
            //     return {
            //       fileList: newFileList,
            //     };
            //   });
            // },
            beforeUpload: (file) =>{
                const reportType = getFieldValue('reportType')
                let filePath = Utils.getReportFilePath(reportType);
                let fileType = file.type.split("/")[0];
                const currentTime = new Date().getTime();
                // 获取文件路径
                file.filePath = `${filePath}${currentTime}${file.name}`
                // 获取文件类型
                file.fileType = Utils.getReportFileType(fileType);
                return true;
            },
            customRequest: (props) => {
                this.handleUpload(props.file)
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
              }
            }
        };
        let exFormItem;
        let reportType = getFieldValue('reportType')
        switch (reportType){
            case "7":
                exFormItem = (
                    <FormItem label="设备类型" {...fromItemLayout}>
                        {
                            getFieldDecorator('concreteType',{
                                initialValue: ''
                            })(
                                <Select placeholder="请选择设备系统类型">
                                    <Option value="1">信号</Option>
                                    <Option value="2">视频检测</Option>
                                    <Option value="3">监控</Option>
                                    <Option value="4">闸道</Option>
                                    <Option value="5">微波</Option>
                                    <Option value="6">单点</Option>
                                    <Option value="7">卡口</Option>
                                    <Option value="8">电警</Option>
                                    <Option value="9">链路</Option>
                                    <Option value="10">地磁</Option>
                                    <Option value="11">诱导</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                )
                break;
            case "8":
                exFormItem = (
                    <FormItem label="设施类别" {...fromItemLayout}>
                        {
                            getFieldDecorator('concreteType',{
                                initialValue: ''
                            })(
                                <Select placeholder="请选择设施类别">
                                    <Option value="1">电子标识类</Option>
                                    <Option value="2">标识类</Option>
                                    <Option value="3">标线类</Option>
                                    <Option value="4">隔离设施类</Option>
                                    <Option value="5">临时设施类</Option>
                                    <Option value="6">其他</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                )
                break;
            default:
                exFormItem="";
                break;           
        }
        return (
            <Fragment>
                <Form layout="horizontal">
                    {   
                        this.props.formType === 'add'?
                        <FormItem label="上报类型" {...fromItemLayout}>
                            {
                                getFieldDecorator('reportType',{
                                    initialValue: ''
                                })(
                                    <TreeSelect
                                        style={{ width: 300 }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="请选择上报类型"
                                        required={true}
                                        treeDefaultExpandAll
                                    >
                                        <TreeNode value="01" title="异常路况" key="parent1" disabled={true}>
                                            <TreeNode value="1" title="拥堵" key="child1"/>
                                            <TreeNode value="2" title="施工" key="child2"/>
                                            <TreeNode value="3" title="积水" key="child3"/>
                                            <TreeNode value="4" title="危险" key="child4"/>
                                        </TreeNode>
                                        <TreeNode value="02" title="事件处理" key="parent2" disabled={true}>
                                            <TreeNode value="5" title="事故" key="child5"/>
                                            <TreeNode value="6" title="其他" key="child6"/>
                                        </TreeNode>
                                        <TreeNode value="03" title="故障上报" key="parent3" disabled={true}>
                                            <TreeNode value="7" title="设备" key="child7"/>
                                            <TreeNode value="8" title="设施" key="child8"/>
                                        </TreeNode>
                                </TreeSelect>
                                )
                            }
                        </FormItem>:''
                    }
                    <FormItem label="图片/视频" {...fromItemLayout}>
                        {
                            getFieldDecorator('srcList',{
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile,
                            })(
                                <Upload name="logo" {...uploadProps} listType="picture" multiple={true}>
                                {
                                    this.props.formType === 'add'?
                                    (<Button
                                        disabled={getFieldValue('reportType')?false:true}
                                    >
                                        <Icon type="upload" /> 提交图片或者视频
                                    </Button>):
                                    (<Button>
                                        <Icon type="upload" /> 提交图片或者视频
                                    </Button>)
                                }
                                </Upload>
                            )
                        }
                    </FormItem>
                    <FormItem label="地址" {...fromItemLayout}>
                        {
                            getFieldDecorator('address',{
                                initialValue: ''
                            })(
                                <Input
                                    placeholder="选择上报地址"
                                    disabled={true}
                                    required={true}
                                    prefix={<Icon 
                                        type="environment" 
                                        theme="filled" 
                                        style={{color: '#1c6fec', cursor: 'pointer'}}
                                        onClick={() => this.handleMapOpen()}
                                    />}
                                />
                            )
                        }
                    </FormItem>
                    <FormItem label="严重程度" {...fromItemLayout}>
                        {
                            getFieldDecorator('severity',{
                                initialValue: '0'
                            })(
                                <Radio.Group buttonStyle="solid">
                                    <Radio.Button value="0">低</Radio.Button>
                                    <Radio.Button value="1">中</Radio.Button>
                                    <Radio.Button value="2">高</Radio.Button>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label="情况描述" {...fromItemLayout}>
                        {
                            getFieldDecorator('remark',{
                                initialValue: ''
                            })(
                                <TextArea placeholder="请输入情况描述（选填）" autosize={{ minRows: 2, maxRows: 5 }} />   
                            )
                        }
                    </FormItem>
                    <FormItem style={{marginBottom: 0}}>
                        {
                            getFieldDecorator('x',{
                                initialValue: ''
                            })(
                                <Input type="hidden"/>   
                            )
                        }
                    </FormItem>
                    <FormItem style={{marginBottom: 0}}>
                        {
                            getFieldDecorator('y',{
                                initialValue: ''
                            })(
                                <Input type="hidden"/>   
                            )
                        }
                    </FormItem>
                    {
                        this.props.formType === 'add'?'':
                        <FormItem label="是否完成" {...fromItemLayout}>
                            {
                                getFieldDecorator('isAccomplish',{
                                    valuePropName: 'checked' 
                                })(
                                    <Switch checkedChildren="是" unCheckedChildren="否"/>
                                )
                            }
                        </FormItem>
                    }
                    { exFormItem }
                </Form>
                <LocationSelectModal 
                    isShowMapSelect={isShowMapSelect}
                    handleMapClose={this.handleMapClose} 
                    handleMapSubmit={this.handleMapSubmit}
                />
            </Fragment>
        )
    }
}

export default Form.create({})(EventForm);