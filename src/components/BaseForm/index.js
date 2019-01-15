import React from 'react';
import {Input, Select, Form, Button, Checkbox, DatePicker, TreeSelect} from 'antd'
import Utils from '../../utils/utils';
const FormItem = Form.Item;

class FilterForm extends React.Component{

    handleFilterSubmit = () => {
        let fieldsValue = this.props.form.getFieldsValue();
        this.props.filterSubmit(fieldsValue);
    }

    reset = () => {
        this.props.form.resetFields();
    }

    initFormList = () => {
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        const formItemList = [];
        if(formList && formList.length > 0) {
            formList.forEach((item, i) => {
                let label = item.label;
                let field =  item.field;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                if (item.type === '城市'){
                    const CITY = <FormItem label="城市" key="城市">
                        {
                            getFieldDecorator('city',{
                                initialValue: '0'
                            })(
                                <Select 
                                    style={{ width: 150 }}
                                    placeholder={placeholder}    
                                >
                                    {Utils.getOptionList([{id: '0', name: '全部'},{id: '1', name: '北京'},{id: '2', name: '天津'},{id: '3', name: '上海'},{id: '4', name: '杭州'}])}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(CITY)
                }else if(item.type === '时间查询'){
                    const BEGIN_TIME = <FormItem label="上报时间" key="时间查询beginTime">
                        {
                            getFieldDecorator('beginTime')(
                                <DatePicker style={{ width: 175 }} showTime={true} placeholder="选择开始时间" format="YYYY-MM-DD HH:mm:ss"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(BEGIN_TIME);
                    const END_TIME = <FormItem label="~" colon={false} key="时间查询endTime">
                        {
                            getFieldDecorator('endTime')(
                                <DatePicker  style={{ width: 175 }} showTime={true} placeholder="选择结束时间" format="YYYY-MM-DD HH:mm:ss"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(END_TIME);
                }else if (item.type === '日期查询'){
                    const BEGIN_TIME = <FormItem label="上报时间" key="日期查询beginTime">
                    {
                        getFieldDecorator('beginTime')(
                            <DatePicker style={{ width: 130 }} showTime={false} placeholder="选择开始时间" format="YYYY-MM-DD"/>
                        )
                    }
                    </FormItem>
                    formItemList.push(BEGIN_TIME);
                    const END_TIME = <FormItem label="~" colon={false} key="日期查询endTime">
                        {
                            getFieldDecorator('endTime')(
                                <DatePicker  style={{ width: 130 }} showTime={false} placeholder="选择结束时间" format="YYYY-MM-DD"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(END_TIME);
                }else if(item.type === 'INPUT'){
                    const INPUT = <FormItem label={label} key={item.type + field} >
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Input type="text" style={{ width: width }} placeholder={placeholder}/>
                            )
                        }
                    </FormItem>
                    formItemList.push(INPUT)
                }else if(item.type === 'SELECT'){
                    const SELECT = <FormItem label={label} key={item.type + field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Select 
                                    style={{ width: width }}
                                    placeholder={placeholder}    
                                >
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                }else if(item.type === 'TREESELECT'){
                    const SELECT = <FormItem label={label} key={item.type + field}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <TreeSelect
                                    style={{ width: width }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={item.list}
                                    treeDefaultExpandAll
                                />
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                }else if(item.type === 'CHECKBOX'){
                    const CHECKBOX = <FormItem label={label} key={item.type + field}>
                        {
                            getFieldDecorator(field,{
                                valuePropName: 'checked',
                                initialValue: initialValue // true || false
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>;
                    formItemList.push(CHECKBOX)
                }else if(item.type === 'DATE'){
                    const Date = <FormItem label={label} key={item.type + field}>
                        {
                            getFieldDecorator(field)(
                                <DatePicker showTime={false} placeholder={placeholder} format="YYYY-MM-DD"/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
            })
        }
        return formItemList;
    }

    render(){
        return (
            <Form layout="inline">
                {this.initFormList()}
                <FormItem>
                    <Button type="primary" style={{margin:'0 20px'}} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create({})(FilterForm)