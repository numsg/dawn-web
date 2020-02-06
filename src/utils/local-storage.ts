export default {


    /**
     * 设置缓存
     * @param {*} key
     * @param {*} data
     * @param {number} [expiress] minute
     */
    set(key: any, data: any, expiress?: number) {
        const params = { key, data, expiress };
        if (expiress) {
            const val = Object.assign(params, { startTime: Date.now() });
            localStorage.setItem(key, JSON.stringify(val));
        } else {
            if (data !== null && (typeof data === 'object')) {
                data = JSON.stringify(data);
            }
            localStorage.setItem(key, data);
        }
    },

    /**
     * get查询
     */
    get(key: any) {
        let item: any = localStorage.getItem(key);
        try {
            item = JSON.parse(String(item).toString());
        } catch (error) {
            item = localStorage.getItem(key);
        }
        if (item === null || item === 'null') {
            return null;
        } else if (item === 'undefined') {
            return undefined;
        } else {
            if (item && item.startTime) {
                const date = Date.now();
                if (date - item.startTime > item.expiress * 24 * 60 * 60 * 1000) {
                    localStorage.removeItem(key);
                    return null;
                } else {
                    return item.data;
                }
            } else {
                return item;
            }
        }
    },

    /**
     * 修改 key 对应对象 中的字段
     * 如果对象不存在则创建
     */
    // modify(key: any, fields: any) {
    //     let obj = this.get(key);
    //     if (obj === null) {
    //         obj = {};
    //     }
    //     if (obj instanceof Object && fields) {
    //         for (const name in fields) {
    //             if (name !== null) {
    //                 obj[name] = fields[name];
    //             }
    //         }
    //         this.set(key, obj);
    //     }
    // },

    /**
     * 删除
     */
    remove(key: any) {
        if (key instanceof Array) {
            for (const k of key) {
                if (k !== null) {
                    localStorage.removeItem(k);
                }
            }
        } else {
            localStorage.removeItem(key);
        }
    }
};

