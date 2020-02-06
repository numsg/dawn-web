
import odataClient from '@gsafety/odata-client/dist';
import store from '@/store';

export default class OdataService {

    queryObject: any;

    generateQueryObject(entityName: string) {
        this.queryObject =  odataClient({
            service: store.getters.configs.odataUrl,
            resources: entityName,
            format: 'json'
        });
        return this;
    }

    top(num: number) {
        this.queryObject.top(num);
        return this;
    }

    skip(num: number) {
        this.queryObject.skip(num);
        return this;
    }

    filter(left: string, op?: string, right?: string) {
        this.queryObject.filter(left, op, right);
        return this;
    }

    expression(left: string, op?: string, right?: string) {
        this.queryObject.expression(left, op, right);
        return this;
    }

    identifier(str: string) {
        this.queryObject.identifier(str);
        return this;
    }

    literal(str: string) {
        this.queryObject.literal(str);
        return this;
    }

    exact(str: string) {
        this.queryObject.exact(str);
        return this;
    }

    and(left: string, op: string, right: string) {
        this.queryObject.and(left, op, right);
        return this;
    }

    or(left: string, op: string, right: string) {
        this.queryObject.or(left, op, right);
        return this;
    }

    not(left: string, op: string, right: string) {
        this.queryObject.not(left, op, right);
        return this;
    }

    all(field: string, property: string, op: string, value: any) {
        this.queryObject.all(field, property, op, value);
        return this;
    }

    any(field: string, property: string, op: string, value: any) {
        this.queryObject.any(field, property, op, value);
        return this;
    }

    resource(resource: string, value?: any) {
        this.queryObject.resource(resource, value);
        return this;
    }

    fn(name: string, args: any) {
        this.queryObject.fn(name, args);
        return this;
    }

    select(items: any) {
        this.queryObject.select(items);
        return this;
    }

    expand(item: string) {
        this.queryObject.expand(item);
        return this;
    }

    search(term: string) {
        this.queryObject.expand(term);
        return this;
    }

    count(param: any) {
        this.queryObject.count(param);
        return this;
    }

    orderby(item: string, dir?: string) {
        this.queryObject.orderby(item, dir);
        return this;
    }

    query() {
        return this.queryObject.query();
    }

    get(options?: any) {
        return this.queryObject.get(options);
    }

    post(body: any, options?: any) {
        return this.queryObject.post(body, options);
    }

    put(body: any, options?: any) {
        return this.queryObject.put(body, options);
    }

    patch(body: any, options?: any) {
        return this.queryObject.patch(body, options);
    }

    merge(body: any, options?: any) {
        return this.queryObject.merge(body, options);
    }

    delete(options?: any) {
        return this.queryObject.delete(options);
    }

}
