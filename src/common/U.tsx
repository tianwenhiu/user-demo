import {  PagerModel } from "../component/Model";
import CTYPE from "./CTYPE";


const U = {
    str: {
        isNull: (s: any): boolean => {
            return (s === null || typeof s === 'undefined');
        },
        isEmpty: (s: any): boolean => {
            if (U.str.isNull(s)) {
                return true;
            }
            if (typeof s != 'string') {
                return false;
            }
            return s.length === 0;
        },
        isNotEmpty: (s: string | null | undefined): boolean => {
            return !U.str.isEmpty(s);
        },
        trim: (x: string): string => {
            return x.replace(/^\s+|\s+$/gm, '');
        },
        isChinaMobile: (mobile: string = ''): boolean => {
            return mobile.length === 11;
        },
        passwordLengthValid: (password: string = ""): boolean => {
            return password.length <= 18 && password.length >= 6;
        },
    },

    date: {
        format: (date: Date, fmt: string): (string | null) => {
            if (!date || !fmt) {
                return null;
            }
            var o: any = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
                'H+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                'S': date.getMilliseconds(),
            };
            var week: any = {
                '0': '\u65e5',
                '1': '\u4e00',
                '2': '\u4e8c',
                '3': '\u4e09',
                '4': '\u56db',
                '5': '\u4e94',
                '6': '\u516d',
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '')
                    .substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt
                    .replace(
                        RegExp.$1,
                        ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f'
                            : '\u5468')
                            : '')
                        + week[date.getDay() + '']);
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1,
                        (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k])
                            .substr(('' + o[k]).length)));
                }
            }
            return fmt;
        }
    },
    pager: {
        getRealIndex: (pagination: PagerModel, index: number) => {
            return (pagination.current - 1) * pagination.pageSize + index + 1;
        }
    },
    setWXTitle: (t: string): void => {
        let i = document.createElement('iframe');
        i.style.display = 'none';
        i.onload = () => {
            setTimeout(() => {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
        document.title = t;
    },
    array: {
        swap: (arr: Array<any>, index1: number, index2: number) => {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },

        remove: (arr: Array<any>, index: number) => {
            if (isNaN(index) || index > arr.length) {
                return [];
            }
            arr.splice(index, 1);
            return arr;
        },

        insert: (arr: Array<any>, index: number, item: any) => {
            arr.splice(index, 0, item);
            return arr;
        },

        insertLast: (arr: Array<any>, item: any) => {
            arr.splice(arr.length, 0, item);
            return arr;
        }
    },

}

export default U;
