import React from 'react'
import {Select} from 'antd'
const Option = Select.Option;

export default {
    formateDate(time){
        if(!time)return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+ 
        (date.getHours() < 10 ? '0' + date.getHours():date.getHours()) +':'+ 
        (date.getMinutes() < 10 ? '0' + date.getMinutes():date.getMinutes()) +':'+
        (date.getSeconds() < 10 ? '0' + date.getSeconds():date.getSeconds());
    },
    pagination(data, callback){
        return {
            onChange: (current)=>{
                callback(current)
            },
            current: data.data.page,
            pageSize: data.data.page_size,
            total: data.data.total_count,
            showTotal: ()=>{
                return `共${data.data.total_count}条`
            },
            showQuickJumper: true
        }
    },
    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [] //[<Option value="0" key="all_key">全部</Option>]
        data.map((item, i) => 
            options.push(<Option value={item.id} key={'OPTION'+item.id}>{item.name}</Option>)
        )
        return options;
    },

    /** 
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem
     */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    },
    getPageSize(){
        let bodyHeight =  document.body.offsetHeight;
        let tableItem = Math.floor((bodyHeight - 50 - 151 - 50 - 64) / 50)
        return tableItem
    },
    getReportFilePath(reportType){
        let filePath = '';
        switch (reportType) {
            case '1':
            case '2':
            case '3':
            case '4':
                filePath = 'abnormal/';
                break;
            case '5':
            case '6':
                filePath = 'event/';
                break;
            case '7':
                filePath = 'equipment/';
                break;
            case '8':
                filePath = 'installation/';
                break;    
            default:
                filePath = 'abnormal/';
                break;   
        }
        return filePath
    },
    getReportFileType(fileType){
        let code 
        switch (fileType){
            case 'image':
                code = 1
                break;
            case 'audio':
                code = 2
                break;
            case 'application':
            case 'text':
                code = 3
                break;
            case 'video':
                code = 4
                break;
            default:
                code = 3
                break;   
        }
        return code;
    },
    formatQueryType(type){
        let concreteType 
        let queryType
        let code
        if(type){
            code = type.split('-')
        }
        switch (code[0]){
            case '0':
                concreteType = ''
                queryType = ''
                break;
            case '1':
            case '2':
                queryType = code[0]
                concreteType = code[1]
                break;
            case '3':
                queryType = code[1]
                concreteType = ''
                break;
            default:
                concreteType = ''
                queryType = ''
                break;   
        }
        return [queryType, concreteType];
    },
    formatQueryTypeForHome(type){
        let concreteType 
        let queryType
        switch (type){
            case '':
                concreteType = ''
                queryType = ''
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                concreteType = type
                queryType = '1'
                break;
            case '5':
            case '6':
                concreteType = type
                queryType = '2'
                break;
            case '7':
                concreteType = ''
                queryType = '3'
                break;
            case '8': 
                concreteType = ''
                queryType = '4'
                break;
            default:
                concreteType = ''
                queryType = ''
                break; 
        }
        return [queryType, concreteType];
    }
}