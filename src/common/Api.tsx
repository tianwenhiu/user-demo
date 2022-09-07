import { message } from 'antd';
import { UserModel, UserQo } from '../component/Model';
import KvStorage from './KvStorage';


const KEY_TABLE_USER = 't_user';

interface FeedBackModel {
    code: number,
    msg?: string,
    data?: object
}

const feedbackSucc = (obj?: object): FeedBackModel => {
    return { code: 200, data: obj }
}

const feedbackFailed = (msg?: string): FeedBackModel => {
    return { code: 0, msg }
}

const desensitizationPass = (u: UserModel) => {
    delete u['password'];
    return u;
};

const desensitizationPassArr = (users: Array<UserModel>) => {
    return users.map(u => {
        return desensitizationPass(u);
    })
};

const mock = (path: string, params?: Record<string, any>): FeedBackModel => {

    params = params || {};

    if (path.startsWith('user/')) {

        const users = JSON.parse(KvStorage.get(KEY_TABLE_USER) || '[]');

        const length = users.length;

        if (path === 'user/save') {
            const user: UserModel = params.user;

            const id = user.id;

            if (!id || id <= 0) {
                const lastId = length ? users[length - 1].id : 0;
                users.push({ ...user, id: lastId + 1 });
            } else {

                const _user = users.find((it: UserModel) => it.id === id);
                if (!_user) {
                    return feedbackFailed('无效的user.id');
                } else {
                    users[users.indexOf(_user)] = { ...user, password: _user.password };
                }
            }
            KvStorage.set(KEY_TABLE_USER, JSON.stringify(users));
            return feedbackSucc();

        } else if (path === 'user/users') {

            const userQo: UserQo = params.userQo;

            //TODO sort | filter
            const { current = 1, pageSize } = userQo;

            const start = (current - 1) * pageSize;
            const end = current * pageSize;

            return feedbackSucc({
                content: [...desensitizationPassArr(users.slice(start, end))],
                pageSize,
                current,
                total: users.length
            });

        } else if (path === 'user/user') {

            const userId: number = params.userId;

            if (!userId || userId <= 0) {
                return feedbackFailed('无效的userId');
            }

            const user = users.find((it: UserModel) => it.id === userId);
            if (!user) {
                return feedbackFailed('不能获取userId');
            }

            return feedbackSucc({ user: { ...desensitizationPass(user) } });

        } else if (path === 'user/remove') {

            const userId: number = params.userId;

            if (!userId || userId <= 0) {
                return feedbackFailed('无效的userId');
            }

            const _user = users.find((it: UserModel) => it.id === userId);
            if (!_user) {
                return feedbackFailed('不能获取userId');
            }
            users.splice(users.indexOf(_user), 1);
            KvStorage.set(KEY_TABLE_USER, JSON.stringify([...users]));

            return feedbackSucc();
        }
    }

    return feedbackFailed();
}

const Api = {
    myPost: (path: string, params?: Record<string, any>) => {

        console.log(path, params);

        return new Promise((resolve, reject) => {

            const ret = mock(path, params);
            console.log(ret);
            const { code = 0, msg = '', data } = ret;

            setTimeout(() => {
                if (code == 200) {
                    resolve(data)
                } else {
                    message.error(msg || '系统繁忙！');
                    reject(ret);
                }
            }, 500);

        });
    }
}

export default Api;
