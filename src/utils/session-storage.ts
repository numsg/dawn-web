export default {

    /**
     * 添加,修改
     *
     * @param {*} key
     * @returns
     */
    set(key: any, data: any, expiress?: number) {
        const params = { key, data, expiress };
        if (expiress) {
            const val = Object.assign(params, { startTime: Date.now() });
            sessionStorage.setItem(key, JSON.stringify(val));
        } else {
            if (data !== null && (typeof data === 'object')) {
                data = JSON.stringify(data);
            }
            sessionStorage.setItem(key, data);
        }
    },

    /**
     * get查询
     */
    get(key: any) {
        let item: any = sessionStorage.getItem(key);
        try {
            item = JSON.parse(String(item).toString());
        } catch (error) {
            item = sessionStorage.getItem(key);
        }
        if (item === null || item === 'null') {
            return null;
        } else if (item === 'undefined') {
            return undefined;
        } else {
            if (item && item.startTime) {
                const date = Date.now();
                if (date - item.startTime > item.expiress * 60 * 1000) {
                    sessionStorage.removeItem(key);
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
    modify(key: any, fields: any) {
        let obj = this.get(key);
        if (obj === null) {
            obj = {};
        }
        if (obj instanceof Object && fields) {
            for (const name in fields) {
                if (name !== null) {
                    obj[name] = fields[name];
                }
            }
            this.set(key, obj);
        }
    },

    /**
     * 删除
     */
    remove(key: any) {
        if (key instanceof Array) {
            for (const k of key) {
                if (k !== null) {
                    sessionStorage.removeItem(k);
                }
            }
        } else {
            sessionStorage.removeItem(key);
        }
    },

    // sessionStorage
    dispatchEventStorage() {
        const storageSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function (key, val) {
            const setEvent: any = new Event('setItemEvent');
            setEvent.key = key;
            setEvent.newValue = val;
            window.dispatchEvent(setEvent);
            const iarguments: any = arguments;
            storageSetItem.apply(this, iarguments);
        };
    }
};


