import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom/client';
import InitRoutes from './routers';
import './styles/common.scss';

let rootDom = document.getElementById('root');
if (rootDom != null) {
  const root = ReactDOM.createRoot(rootDom);
  root.render(
    <ConfigProvider locale={zhCN}>
        <InitRoutes />
    </ConfigProvider>
  );
}