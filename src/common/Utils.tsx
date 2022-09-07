import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom/client';

const Utils = {

    common: {
        renderReactDOM: (child: any, options = {}) => {

            let div = document.createElement('div');
            let { id }: any = options;
            if (id) {
                let e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            }

            document.body.appendChild(div);

            const root = ReactDOM.createRoot(div);
            root.render(<ConfigProvider locale={zhCN}>{child}</ConfigProvider>);

        },

        closeModalContainer: (id: string) => {
            let e = document.getElementById(id);
            if (e) {
                document.body.removeChild(e);
            }
        },

        createModalContainer: (id: string) => {
            //强制清理同名div，render会重复创建modal
            Utils.common.closeModalContainer(id);
            let div = document.createElement('div');
            div.setAttribute('id', id);
            document.body.appendChild(div);
            return div;
        },
    }

};

export default Utils;