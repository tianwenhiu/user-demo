import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import {
    AutoComplete,
    Button, Form,
    Input, message, DatePicker, Upload
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Api, CTYPE, U } from '../../common';
import { UserModel } from '../../component/Model';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';



import moment from 'moment';
const UserEdit: React.FC = () => {

    const routeParams = useParams();
    const userId = parseInt(routeParams.id || '0');

    const [form] = Form.useForm();

    const [user, setUser] = useState<UserModel>({ id: 0 });
    const [saving, setSaving] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        U.setWXTitle('用户管理');
        loadData();
    }, []);

    const loadData = () => {
        if (userId) {
            Api.myPost('user/user', { userId }).then((ret: any) => {
                const { user = {} } = ret;
                setUser({ ...user, _birthDate: user.birthDate ? moment(user.birthDate) : moment() });
            });
        }
    }

    const onFinish = (values: any) => {
        setSaving(true);


        delete values['confirm'];

        let { _birthDate } = values;

        Api.myPost('user/save', {
            user: {
                id: userId,
                ...values,
                birthDate: _birthDate.valueOf(),
                avatar: user.avatar
            }
        }).then(() => {
            message.success('saved');
            setSaving(false);
        }, (ret: any) => {
            message.error(ret.err);
            setSaving(false);
        })
    };

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

    const onWebsiteChange = (value: string) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['.com', '.org', '.net'].map(domain => `${value}${domain}`));
        }
    };

    const websiteOptions = autoCompleteResult.map(website => ({
        label: website,
        value: website,
    }));

    const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    console.log(user);

    const { avatar } = user;

    return (

        <div>
            {(userId === 0 || user.id > 0) && <Form
                {...CTYPE.formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={user}
                scrollToFirstError
            >

                <Form.Item
                    name="userId"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名!', whitespace: true, max: 20, min: 6 }]}
                >
                    <Input showCount maxLength={20} style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: userId === 0,
                            message: '请输入密码!',
                            pattern: /(?![^a-zA-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{8,}$/
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: userId === 0,
                            message: '请输入确认密码!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        {
                            type: 'email',
                            message: '输入的电子邮件无效，请重新输入!',
                        },
                        {
                            required: true,
                            message: '请输入电子邮件!',
                        },
                    ]}
                >
                    <Input style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                    name="mobile"
                    label="手机号"
                    rules={[{ required: true, pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入手机号!' }]}
                >
                    <Input style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                    name="website"
                    label="网址"
                    rules={[{ required: true, message: '请输入网址!', pattern: /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ }]}
                >
                    <AutoComplete options={websiteOptions} onChange={onWebsiteChange} >
                        <Input style={{ width: 300 }} />
                    </AutoComplete>
                </Form.Item>

                <Form.Item
                    name="idNO"
                    label="身份证号"
                    rules={[{ required: true, len: 18, message: '请输入身份证号！' }]}
                >
                    <Input showCount maxLength={18} style={{ width: 300 }} />
                </Form.Item>

                <Form.Item name="_birthDate" label="生日" rules={[{ required: true, message: '请选择日期!' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="头像" >
                    <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={(file: RcFile) => {
                            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                            if (!isJpgOrPng) {
                                message.error('只能上传JPG/PNG文件!');
                            }
                            const isLt2M = file.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                                message.error('图片大小必须小于2MB!');
                            }
                            return isJpgOrPng && isLt2M;
                        }}
                        onChange={(info: UploadChangeParam<UploadFile>) => {
                            // Get this url from response in real world.
                            getBase64(info.file.originFileObj as RcFile, url => {
                                setUploading(false);
                                setUser({
                                    ...user,
                                    avatar: url
                                })
                            });
                        }}
                    >
                        {avatar ? <img src={avatar} style={{ width: '100%' }} /> : <div>
                            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>}
                    </Upload>
                </Form.Item>

                <Form.Item {...CTYPE.tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" loading={saving}>
                        保存
                    </Button>
                </Form.Item>
            </Form>}
        </div>
    );
};

export default UserEdit;