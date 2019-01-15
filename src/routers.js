import React from 'react'
import { HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import App from './App'
import Login from './pages/login'   
import Admin from './admin'
import Home from './pages/home'
import Handle from './pages/handle'
import Police from './pages/police'
import PoliceDetail from './pages/police/detail'
import Advice from './pages/advice'
import Setting from './pages/setting'
import User from './pages/setting/user';
import Role from './pages/setting/role';
import Daily from './pages/setting/daily';
import NoMatch from './pages/nomatch';
import Common from './common';
export default class IRouter extends React.Component{
    
    render(){
        return (
            <HashRouter>
                <LocaleProvider locale={zh_CN}>
                    <App>
                        <Switch>
                            <Route path="/login" component={Login}/>
                            <Route path="/common" render={()=>
                                <Common>
                                    <Route path="/common/police/detail/:policeId" component={PoliceDetail}/>
                                </Common>
                            }/>
                            <Route path="/" render={()=>
                                <Admin> 
                                    <Switch>
                                        <Route path="/home" component={Home}/>
                                        <Route path="/handle" component={Handle}/>
                                        <Route path="/police" component={Police}/>
                                        <Route path="/advice" component={Advice}/>
                                        <Route path="/setting" render={()=> 
                                            <Setting>
                                                <Switch>
                                                    <Route path="/setting/user" component={User}/>
                                                    <Route path="/setting/role" component={Role}/>
                                                    <Route path="/setting/daily" component={Daily}/>
                                                    {/* 设置页面往此处添加 */}
                                                    <Redirect to="/setting/user"/>
                                                </Switch>
                                            </Setting>
                                        }/>
                                        <Redirect to="/login"/>
                                        <Route component={NoMatch}/>
                                    </Switch>
                                </Admin>
                            }/>
                        </Switch>
                    </App>
                </LocaleProvider>
            </HashRouter>
        )
    }
}