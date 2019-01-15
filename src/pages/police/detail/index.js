import React , {Component, Fragment}from 'react'
import {Card, Avatar} from 'antd'
import { Redirect } from 'react-router-dom'
import CountUp from 'react-countup';
import axios from '../../../axios'
import IndexMap from '../../map/indexMap'
import Pie from '../../charts/pie/pie-for-detail'
import Bar from '../../charts/bar'
import './index.less'
const Meta= Card.Meta;

function RollAnimate(parent,rollEl,dir,rillTime){
    this.parent = parent;
    this.rollEl = rollEl;
    this.dir = dir;
    this.rillTime = rillTime;
    this.elMove();
}

RollAnimate.prototype = {
    // 获取行间样式
    getStyle:function(obj,attr){
      return  obj.attr = obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
    },
    // 滚动
    elMove:function(){
        // 获取要滚动元素当前滚动的值
        var rollChild = this.rollEl.getElementsByClassName('rollChild');
        var len = rollChild.length;
        var iTaget = 0;
        // 获取滚动元素外框的高度
        var rollBoxSize = 0;
        var rollElSize = 0;
        // 每次滚动的距离
        var rollNum = 0;
        // 获取滚动元素滚动前的子元素
        var sHtml = this.rollEl.innerHTML;
        var _this = this;
        // 获取单次滚动的数据
        if(this.dir === 'up') {
            rollBoxSize = _this.parent.offsetHeight;
            rollNum = parseInt(rollChild[0].offsetHeight, 0);
            rollElSize = rollNum*len;
        }else if(this.dir === 'left'){
            rollBoxSize = _this.parent.offsetWidth;
            rollNum = parseInt(rollChild[0].offsetWidth, 0);
            rollElSize = rollNum*len
            this.rollEl.style.width = rollElSize + 'px';
            // rollElSize = parseInt(_this.rollEl.offsetWidth);
        }

        setInterval(function () {
            //修正滚动元素
            if((rollElSize - Math.abs(iTaget)) <= parseInt(rollBoxSize, 0)){
                // 如果滚到最后，增加滚动元素的子元素
                _this.rollEl.innerHTML += sHtml;
                // 修改滚动元素高度,因为向上滚动，元素的高度会自适应，所有向上滚动时不需要设置
                rollElSize *= 2;
               if(_this.dir === 'left'){
                    _this.rollEl.style.width = rollElSize + 'px';
               }

            }else if(rollElSize/2 <= Math.abs(iTaget)){
                // 当所有的都滚动完成后，修正margin-top值、滚动的值还有滚动元素的子元素数量
                rollElSize /= 2; // 修改滚动元素高度
                if(_this.dir === 'up'){
                    _this.rollEl.style.marginTop = 0;
                }else if(_this.dir === 'left'){
                    _this.rollEl.style.marginLeft = 0;
                    _this.rollEl.style.width = rollElSize + 'px';
                }
                iTaget = 0;
                _this.rollEl.innerHTML = sHtml;
            }
            // 增加每次滚动的量
            iTaget -= rollNum;

            // 执行单次滚动
            if(_this.dir === 'up'){

                _this.animate('margin-top',iTaget);

            }else if(_this.dir === 'left'){

                _this.animate('margin-left',iTaget);

            }
        },_this.rillTime);
    },
    // 单次滚动
    animate: function (attr,iTaget) {
        var _this = this;

        clearInterval(this.rollEl.timer);

        this.rollEl.timer = setInterval(function () {
            // 计算速度
            var speed =(iTaget - parseInt(_this.getStyle(_this.rollEl,attr), 0))/8 ;
            // 判断速度是正还是负，正速度向上取整，负的向下取整
            speed = speed > 0 ? Math.ceil(speed):Math.floor(speed)
            var dist = parseInt(_this.getStyle(_this.rollEl,attr), 0);
            if(dist === iTaget){
                clearInterval(_this.rollEl.timer);
            }else{
                dist +=speed;
                _this.rollEl.style[attr] = dist + 'px';
            }
        },50)
    }
}

class Home extends Component{

    state = { 
        infosVisible: true,
        detailID: 1,
        policeDetail: {
            newList: [],
            coordinatesList: [],
            totalCount: 0,
            yearTotalCount: 0,
            monthTotalCount: 0
        },
        pieArray: [0, 0, 0],
        barArray: [0 ,0 ,0, 0, 0, 0, 0, 0],
        redirect: false,
    };

    componentDidMount(){
        let policeId = this.props.match.params.policeId;
        this.getPoliceDetail(policeId)
    }

    getPoliceDetail(id){
        axios.ajax({
            url: '/user/getPoliceDetail.sp',
            data:{
                params: {id}
            }
        }).then((res)=>{
            if(res.state === 0){
                let data = res.data;
                let abnormalCount = data.congestionCount + data.constructionCount + data.waterCount + data.dangerousCount
                let eventCount= data.accidentCount + data.elseCont
                let malfunctionCount = data.equipmentCount + data.installationCount
                this.setState({
                    policeDetail: res.data,
                    pieArray: [abnormalCount,eventCount,malfunctionCount],
                    barArray: [data.congestionCount, data.constructionCount, data.waterCount, data.dangerousCount, data.accidentCount, data.elseCont, data.equipmentCount,  data.installationCount]
                })
                if(data.newList.length > 0){
                    let rollBox = document.getElementsByClassName('rollBox')[0];
                    let rollEl = rollBox.getElementsByClassName('rollEl')[0];
                    new RollAnimate(rollBox,rollEl,'up',3000);
                }
            }
        })
    }

    returnList = () => {
        this.setState({
            redirect: true
        })
    }
    
    render(){
        const domFun = (value) => {
            let gmvDom = "";
            let gmv = [];
            gmv = value.toString().split("");
            let dataNum = gmv.length;
            if(dataNum === 3){
                gmvDom += '<div class="num-item">0</div>';
            }else if(dataNum === 2){
                gmvDom += '<div class="num-item">0</div><div class="num-item">0</div>';
            }else if(dataNum === 1){
                gmvDom += '<div class="num-item">0</div><div class="num-item">0</div><div class="num-item">0</div>'
            }
            gmv.forEach(function (item,index) {
                if (item.match('^[0-9]*$')){
                    gmvDom += '<div class="num-item">' + item + '</div>';
                }else{
                    gmvDom += item;
                }
            });
            return gmvDom;
        }
        const levelArray = ['低', '中', '高']
        const rendenRollEl = (data) =>{
            return data.map((item, index)=>{
                return (<li className="rollChild" key={"detail" + index}><span>{item.time}</span><span>{item.typeName}</span><span>{item.address}</span><span>{levelArray[item.severity]}</span></li>)
            })
        }
        if (this.state.redirect) {
            return <Redirect push to="/police" />; 
        }
        return (
            <Fragment>
                <div className="police-detail-wrap">
                    <div className="return-btn" onClick={this.returnList}></div>
                    <div className="top-wrap">
                        <div className="top-left-wrap">
                            <Card bordered={false}>
                                <Meta
                                    avatar={<Avatar src={this.state.policeDetail.photo} shape="square"/>}
                                    title={
                                        <div className="police-info">
                                            <div className="police-name"><span className="label">姓名：</span>{this.state.policeDetail.realName}</div>
                                            <div><span className="label">警号：</span>{this.state.policeDetail.policeNumber}</div>
                                            <div><span className="label">手机号：</span>{this.state.policeDetail.phone}</div>
                                            <div><span className="label">职务：</span>{this.state.policeDetail.duty}</div>
                                            <div><span className="label">辖区：</span>{this.state.policeDetail.genericTerms}</div>
                                            <div style={{display: 'flex'}}><span className="label">个人考评总分：</span><CountUp className="num-box" start={0} end={this.state.policeDetail.score||0} duration={3} formattingFn={domFun}/></div>
                                            <div className="medal gold-medal"></div>
                                            
                                        </div>
                                    }
                                />
                            </Card>
                            <div className="info-bg"></div>
                        </div>
                        <div className="top-right-wrap">
                            <div className="bg-wrap"></div>
                            <div className="min-map-container">
                                <IndexMap data={this.state.policeDetail.coordinatesList} type="min"/>
                            </div>
                            <div className="data-float-layer">
                                <div className="title">上报总量</div><CountUp className="num-box" start={0} end={this.state.policeDetail.totalCount||0} duration={3}/>
                                <div className="title">年度上报总量</div><CountUp className="num-box" start={0} end={this.state.policeDetail.yearTotalCount||0} duration={3}/>
                                <div className="title">本月上报总量</div><CountUp className="num-box" start={0} end={this.state.policeDetail.monthTotalCount||0} duration={3}/>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-wrap">
                        <div className="bottom-left-wrap">
                            <div className="bottom-wrap-title">类型占比</div>
                            <div className="bottom-wrap-content">
                                <Pie data={this.state.pieArray}></Pie>
                            </div>
                        </div>
                        <div className="bottom-center-wrap">
                            <div className="bottom-wrap-title">类型总量</div>
                            <div className="bottom-wrap-content">
                                <Bar data={this.state.barArray}></Bar>
                            </div>
                        </div>
                        <div className="bottom-right-wrap">
                            <div className="bottom-wrap-title">最近上报</div>
                            <div className="bottom-wrap-content">
                                <div className="title"><span>时间</span><span>类型</span><span>地址</span><span>严重程度</span></div>
                                <div className="rollBox">
                                    <ul className="rollEl">
                                        {rendenRollEl(this.state.policeDetail.newList)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Home