import { Cookies } from 'react-cookie';
import U from './U';

const cookies = new Cookies();

interface KVOptionModel {
    localStorageEnabled: boolean,
    cookieEnabled: boolean,
    sessionStorageEnabled: boolean,
    expiresIn: number
};

let gOptions: Record<string, any> = {
    localStorageEnabled: true,
    cookieEnabled: false,
    sessionStorageEnabled: true
};


let gMap: Record<string, any> = {};

let removeStorage = (storage: Storage | null, key: string) => {
    try {
        if (!storage) {
            return false;
        }
        storage.removeItem(key);
        storage.removeItem('__expire__' + key);
        return true;
    } catch (e) {
        return false;
    }
};
let getStorage = (storage: Storage | null, key: string) => {
    try {
        if (!storage) {
            return null;
        }
        let expires = Number(storage.getItem('__expire__' + key));
        if (U.str.isEmpty(expires)) {
            expires = -1;
        } else {
            expires = Number(expires);
        }
        if (expires < Date.now()) {
            removeStorage(storage, key);
            return null;
        } else {
            return storage.getItem(key);
        }
    } catch (e) {
        return null;
    }
};
let setStorage = (storage: Storage | null, key: string, value: any, options?: KVOptionModel | undefined) => {
    try {
        if (!storage) {
            return false;
        }
        let expiresIn = (options || {}).expiresIn;
        if (U.str.isEmpty(expiresIn)) {
            expiresIn = 86400 * 30;  // default: seconds for 30 day
        } else {
            expiresIn = Math.abs(expiresIn || 0);
        }
        let expires = Date.now() + expiresIn * 1000;
        storage.setItem('__expire__' + key, expires.toString());
        storage.setItem(key, value);
        return true;
    } catch (e) {
        return false;
    }
};
let getCookie = (k: string) => {
    if (!gOptions.cookieEnabled) {
        return null;
    }
    return cookies.get(k);
};
let setCookie = (k: string, v: any, options?: KVOptionModel) => {
    if (!gOptions.cookieEnabled) {
        return false;
    }
    let expiresIn = (options || {}).expiresIn;
    cookies.set(k, v, {
        path: '/',
        expires: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined
    });
    //test whether cookie is saved
    if (cookies.get(k) === v) {
        return true;
    }
    return false;
};
let removeCookie = (k: string) => {
    try {
        cookies.remove(k);
        return true;
    } catch (e) {
        return false;
    }
};
// prefer localStorage > cookie > sessionStorage > memory
const KvStorage = {
    setOptions: (options: Record<string, any>): void => {
        for (let key in options) {
            gOptions[key] = options[key];
        }
    },
    get: (k: string): string | null => {
        let v;
        v = getStorage(gOptions.localStorageEnabled ? window.localStorage : null, k);
        if (!U.str.isEmpty(v)) {
            return v;
        }
        v = getCookie(k);
        if (!U.str.isEmpty(v)) {
            return v;
        }
        v = getStorage(gOptions.sessionStorageEnabled ? window.sessionStorage : null, k);
        if (!U.str.isEmpty(v)) {
            return v;
        }
        v = gMap[k];
        return v;
    },
    set: (k: string, v: any, options?: KVOptionModel): boolean => {
        if (U.str.isEmpty(v)) {
            return false;
        }
        if (typeof v != 'string') {
            v = v.toString();
        }
        let saved = false;
        saved = setStorage(gOptions.localStorageEnabled ? window.localStorage : null, k, v, options);
        if (saved) {
            return true;
        }
        saved = setCookie(k, v, options);
        if (saved) {
            return true;
        }
        saved = setStorage(gOptions.sessionStorageEnabled ? window.sessionStorage : null, k, v, options);
        if (saved) {
            return true;
        }
        gMap[k] = v;
        return true;
    },
    remove: (k: string): void => {
        removeStorage(window.localStorage, k);
        removeCookie(k);
        removeStorage(window.sessionStorage, k);
        delete gMap[k];
    }
};

export default KvStorage;