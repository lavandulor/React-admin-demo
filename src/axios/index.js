import JsonP from 'jsonp'
import axios from 'axios'
import {Modal, message} from 'antd'
import Utils from './../utils/utils'
export default class Axios{

    static MockApi = 'https://www.easy-mock.com/mock/5c04cd3f2775cc3f82910ba4/JTbaoZDQW';
    // static DevelopApi = 'http://192.168.57.54:8080/JTbaoZDQWPT/';
    // static DevelopApi = 'http://localhost/JTbaoZDQWPT/';
    static DevelopApi = 'http://118.31.38.245:3008/JTbaoZDQWPT/';

    static requestList(_this, url, params, isMock){
        var data = {
            params: params,
            isMock: isMock 
        }
        this.ajax({
            url,
            data
        }).then((res) => {
            if(res && res.data){
                let list = res.data.item_list.map((item, index) => {
                    item.key = index;
                    return item;
                })
                _this.setState({
                    list,
                    pagination: Utils.pagination(res, (current)=>{
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
                if(_this.handleRowClick && typeof _this.handleRowClick === "function"){
                    _this.handleRowClick(res.data.item_list[0])
                }
            }
        });
    }

    static requestListWithoutLoading(_this, url, params, isMock){
        var data = {
            params: params,
            isMock: isMock,
            isShowLoading: false
        }
        this.ajax({
            url,
            data
        }).then((res) => {
            if(res && res.data){
                let list = res.data.item_list.map((item, index) => {
                    item.key = index;
                    return item;
                })
                _this.setState({
                    list,
                    pagination: Utils.pagination(res, (current)=>{
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
                if(_this.handleRowClick && typeof _this.handleRowClick === "function"){
                    _this.handleRowClick(res.data.item_list[0])
                }
            }
        });
    }

    static jsonp(options){
        return new Promise((resolve, reject)=>{
            JsonP(options.url,{
                param: 'callback'
            }, function(err, response){
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }

    static fileUpload(options){
        const hide = message.loading('文件提交中...', 0);
        axios({
            url: options.url,
            baseURL: this.DevelopApi,
            method: 'post',
            data: options.formData,
        }).then((response)=>{
            setTimeout(hide, 0);
            if(response.status === 200){
                let res = response.data;
                if(res.state === 0){
                    message.success('文件上传成功.');
                }else{
                    message.error(res.message);
                }
            }else{
                console.log(response)
            }
        })
    }

    static ajax(options){
        let loading;
        if(options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading')
            loading.style.display = 'block'
        }
        options.method = options.method || 'GET'
        let isAuthenticated = sessionStorage.getItem("admin_user") ? true : false;
        if(isAuthenticated){
            var user = JSON.parse(sessionStorage.getItem('admin_user'))
            options.data.params.sessionKey = user.sessionKey
        }
        return new Promise((resolve, reject)=>{
            axios({
                url: options.url,
                method: options.method,
                baseURL: this.DevelopApi,
                timeout: 60000,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if(options.data && options.data.isShowLoading !== false){
                    loading = document.getElementById('ajaxLoading')
                    loading.style.display = 'none'
                }
                if(response.status === 200){
                    let res = response.data;
                    if(res.state === 0){
                        resolve(res);
                    }else{
                        Modal.info({
                            title: '提示',
                            content: res.message
                        })
                    }
                }else{
                    reject(response.data)
                }
            }).catch((error)=>{
                if(options.data && options.data.isShowLoading !== false){
                    loading = document.getElementById('ajaxLoading')
                    loading.style.display = 'none'
                }
                Modal.error({
                    title: '提示',
                    content: '网络连接错误'
                })
            })
        });
    }
}