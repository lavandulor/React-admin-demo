import React, {Component} from 'react'
import AMap from './../AMapModule';
import { Form, Input, Modal} from 'antd';

const FormItem = Form.Item;

class LocationSelectModal extends Component{
    handleMapClose=()=>{
        this.props.handleMapClose()
    }

    handleMapSubmit=()=>{
        let fieldsValue = this.props.form.getFieldsValue();
        this.props.handleMapSubmit(fieldsValue);
    }

    render(){
        const { getFieldDecorator, setFieldsValue, getFieldValue} = this.props.form;
        const fromItemLayout = {
            labelCol: {
                span: 2
            },
            wrapperCol: {
                span: 22
            }
        }

        return (
            <Modal
                title="选择地址"
                visible={this.props.isShowMapSelect}
                onCancel={this.handleMapClose}
                onOk={this.handleMapSubmit}
            >
                <Form>
                    <FormItem label={<span>地址</span>} {...fromItemLayout}>  
                        {
                            getFieldDecorator('position', {  
                                initialValue: ''  
                            })(  
                                <Input placeholder={'请输入地址查询点位'} />  
                            )
                        }  
                    </FormItem>  
                    <FormItem {...fromItemLayout} style={{marginBottom: 0}}>  
                        {
                            getFieldDecorator('longitude', {  
                                initialValue: ''  
                            })(  
                                <Input disabled={true} type="hidden"/>  
                            )
                        }  
                    </FormItem>  
                    <FormItem {...fromItemLayout} style={{marginBottom: 0}}>  
                        {
                            getFieldDecorator('latitude', {  
                                initialValue: ''  
                            })(  
                                <Input disabled={true} type="hidden"/>  
                            )
                        }  
                    </FormItem>  
                    <AMap   
                        lng={''}  
                        lat={''}  
                        address={getFieldValue('position')}  
                        getMapPoint={(point)=>{  
                            setFieldsValue({  
                                latitude: point.lat,  
                                longitude: point.lng  
                            });  
                        }}  
                        getMapAddress={(address)=>{  
                            setFieldsValue({  
                                position: address  
                            });  
                        }}  
                    />  
                </Form>  
            </Modal>
        )
    }
}

LocationSelectModal = Form.create({})(LocationSelectModal);

export default LocationSelectModal