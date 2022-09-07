import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Dropdown, Image, Menu, message, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api, U } from "../../common";
import { PagerModel, UserModel } from '../../component/Model';

const { confirm } = Modal;

const Users = () => {

    const navigate = useNavigate();

    let [list, setList] = useState<Array<UserModel>>([]);
    let [loading, setLoading] = useState<boolean>(false);

    let [pagination, setPagination] = useState<PagerModel>({
        pageSize: 10,
        current: 1,
        total: 0
    });
    let [sortPropertyName, setSortPropertyName] = useState<string>('id');
    let [sortAscending, setSortAscending] = useState<boolean>(false);

    useEffect(() => {
        U.setWXTitle('用户列表');
    }, []);

    const loadData = () => {
        setLoading(true);
        setList([]);
        Api.myPost('user/users', {
            userQo: {
                sortPropertyName,
                sortAscending,
                ...pagination
            }
        }).then((result: any) => {
            let { content = [] } = result;;
            setList(content);
            setPagination({ ...result });
            setLoading(false);
        }, () => {
            setLoading(false);
        });
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        let { field, order } = sorter;

        setPagination(pagination);
        setSortPropertyName(order ? field : 'id');
        setSortAscending(order === 'ascend');

    };

    useEffect(loadData, [pagination.current, sortAscending, sortPropertyName]);

    const edit = (id: number) => navigate(`/user-edit/${id}`)

    const remove = (userId: number) => {
        confirm({
            title: `确认删除吗?`,
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                Api.myPost('user/remove', { userId }).then(() => {
                    message.success('操作成功');
                    loadData();
                })
            }
        });
    };
     
    let imgs: Array<string> = [];
    list.map((item) => imgs.push(item.avatar || ''));

    return <div className='articles-page'>

        <Card title="用户列表" extra={<Button type='primary' onClick={() => edit(0)}>添加</Button>}>

            <Table columns={[{
                title: '序号',
                dataIndex: 'index',
                align: 'center',
                width: 50,
                render: (text, item, index) => U.pager.getRealIndex(pagination, index)
            }, {
                title: 'ID',
                dataIndex: 'id',
                align: 'center',
                width: 50,
            }, {
                title: '头像',
                dataIndex: 'avatar',
                align: 'center',
                width: 80,
                render: avatar => <Avatar icon={<Image preview={true} src={avatar} width={40} />} />
            }, {
                title: '用户名',
                dataIndex: 'userId',
                width: '80px',
                align: 'center',
            }, {
                title: '手机号',
                dataIndex: 'mobile',
                align: 'center',
                width: 80,
            }, {
                title: '身份证号',
                dataIndex: 'idNO',
                align: 'center',
                width: 120,
                sorter: true
            }, {
                title: '生日',
                dataIndex: 'birthDate',
                align: 'center',
                width: 150,
                sorter:(a,b) => (a.birthDate || 0) - (b.birthDate || 0),
                render: (birthDate) => U.date.format(new Date(birthDate), 'yyyy-MM-dd')
            }, {
                title: '操作',
                dataIndex: 'action',
                width: '80px',
                align: 'center',
                fixed: 'right',
                render: (text, item: UserModel, index) => {

                    let { id } = item;

                    return <Dropdown overlay={<Menu items={[
                        { key: '1', label: <a onClick={() => edit(id)}>编辑</a> },
                        {
                            key: '2', label: <a onClick={() => {
                                remove(id);
                            }}>删除</a>
                        }]}>
                    </Menu>} trigger={['click']}>
                        <a className="ant-dropdown-link">
                            操作 <DownOutlined />
                        </a>
                    </Dropdown>
                }
            }]}
                dataSource={list} pagination={pagination}
                loading={loading}
                onChange={handleTableChange} rowKey={record => record.id} size='small' />
        </Card>
    </div>;
}
export default Users;
