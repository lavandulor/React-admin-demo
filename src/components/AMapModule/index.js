import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

let map = null;
let marker = null;
let geocoder = null;
let zoomLevel = 14;

class AMapModule extends Component {
    constructor() {
        super();
        this.state = {
            status: 0
        };
    }

    componentDidMount(){
        let _this = this;
        if (window.AMap) {
            const { lat, lng, getMapAddress} = _this.props;
            const latlng = [(!lng || lng == 'undefined' || lng == '0') ? 120.164227 : lng, (!lat || lat == 'undefined' || lat == '0') ? 30.272428 : lat] //120.164227,30.272428 默认点位武林广场
            map = new window.AMap.Map('mapContainer',{
                resizeEnable: true,
                center: latlng,
                zoom: zoomLevel
            })

            // 在新中心点添加 marker 
            marker = new window.AMap.Marker({
                map: map,
                position: latlng
            });

            map.on('click',function(e){
                marker.setPosition(e.lnglat);
                window.AMap.service('AMap.Geocoder',function(){ //回调函数
                    //实例化Geocoder
                    geocoder = new window.AMap.Geocoder({});
                    geocoder.getAddress(e.lnglat,function(status,result){
                        if(status === 'complete' && result.info === 'OK'){
                            _this.setState({ status: 1 })
                            let formattedAddress=result.regeocode.formattedAddress;
                            const province = result.regeocode.addressComponent.province;
                            const address = formattedAddress.replace(province, '');
                            getMapAddress&&getMapAddress(address);
                        }
                    })
                })
            })
            _this.setState({  
                status: 1  
            })  
        }
    }

    componentWillReceiveProps = (nextProps) =>{
        const {getMapPoint} = this.props;
        if(window.AMap && nextProps.address && nextProps.address!=this.props.address) {
            window.AMap.service('AMap.Geocoder', function(){ //回调函数
                //实例化Geocoder
                geocoder = new window.AMap.Geocoder({});
                geocoder.getLocation(nextProps.address, function(status, result) {
                    if(status === 'complete' && result.info === 'OK'){
                        let latlng = result.geocodes[0].location;
                        getMapPoint&&getMapPoint(latlng);
                        // 设置缩放级别和中心点
                        let latlngxy = [latlng['lng'],latlng['lat']];
                        const currentZoom=map.getZoom();
                        map.setZoomAndCenter(currentZoom != zoomLevel?currentZoom:zoomLevel, latlngxy);
                        // 在新中心点添加 marker 
                        marker.setPosition(latlng);
                    } else {
                        console.log('search "' + nextProps.address + '" no data')
                    }
                })
            })
        }
    }

    render() {
        const {height} = this.props;
        return (
            <div style={{height: height?height:300}}>
                <Spin spinning= {this.state.status === 0? true: false} tip="加载中...">
                    <div id="mapContainer" style={{height: height?height:300}}></div>
                </Spin>
            </div>
        )
    }
    
}

AMapModule.propTypes = {
    lng: PropTypes.string,
    lat: PropTypes.string,
    className: PropTypes.string
}

export default AMapModule;