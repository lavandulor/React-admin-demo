import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './routers'
import { Provider } from 'react-redux'
import configStore from './redux/store/index'
import registerServiceWorker from './registerServiceWorker';
const store = configStore();
ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
