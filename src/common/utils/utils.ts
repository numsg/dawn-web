import { generateUUID } from '@gsafety/whatever/dist/util';
import * as R from 'ramda';

export const arrayToTree = (data: any[], parentId?: string, key = 'id') => {
  const tree: any[] = [];
  let temp;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].pid === '-1' || data[i].pid === parentId) {
        const obj = data[i];
        const children = data.filter(e => e.pid !== '-1' && e.pid !== parentId);
        temp = arrayToTree(children, obj[key], key);
        if (temp && temp.length > 0) {
          obj.children = temp;
        }
        tree.push(obj);
      }
    }
  }
  return tree;
};

export const arrayToTreeOhter = (data: any[], parentId?: string, key = 'id', pKey = 'pid') => {
  const tree: any[] = [];
  let temp;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if (data[i][pKey] === '-1' || data[i][pKey] === parentId) {
        const obj = data[i];
        const children = data.filter(e => e[pKey] !== '-1' && e[pKey] !== parentId);
        temp = arrayToTreeOhter(children, obj[key], key, pKey);
        if (temp && temp.length > 0) {
          obj.children = temp;
        }
        tree.push(obj);
      }
    }
  }
  return tree;
};

export const treeToArray = (nodes: any, childKey: string = 'children') => {
  if (!nodes) {
    return [];
  }
  let res: any[] = [];
  // const childKey = 'children';
  if (nodes instanceof Array) {
    for (const item of nodes) {
      const node: any = {};
      for (const key in item) {
        if (key !== childKey) {
          node[key] = item[key];
        }
      }
      node[childKey] = [];
      res.push(node);
      if (item[childKey] && item[childKey].length > 0) {
        res = res.concat(treeToArray(item[childKey], childKey));
      }
    }
  } else {
    res.push(nodes);
    if (nodes[childKey]) {
      res = res.concat(treeToArray(nodes[childKey], childKey));
    }
  }
  return res;
};

export const findNodeById = (id: string, array: any[]) => {
  let data;
  const parentNodeIds: string[] = array.map(e => e.id);
  if (parentNodeIds.includes(id)) {
    data = array.find(e => e.id === id);
    return data;
  }
  const oneDimensionalNodes = treeToArray(array);
  for (let i = 0; i < oneDimensionalNodes.length; i++) {
    const element = oneDimensionalNodes[i];
    if (element.id === id) {
      return element;
    }
  }
  return data;
};

/**
 * 延时
 * @param time
 */
export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

/**
 * 防抖函数
 * @param fn
 * @param waitTime
 */
export const debounce = (fn: Function, waitTime: number) => {
  let timeout: any = null;
  const func = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, waitTime);
  };
  func();
};
