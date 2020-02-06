export default {

  /**
 * 获取树形结构所有的节点
 *
 * @param {*} data
 * @param {*} newChildren
 * @returns
 * @memberof LoginComponent
 */
  getChildren(data: any, newChildren: any) {
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item: any) => {
        newChildren.push(item);
        if (item.children != null) {        // item.hasChildren && item.children.length > 0
          this.getChildren(item.children, newChildren);
        }
      });
    }
    return newChildren;
  },

  /**
 * 把节点转换成树结构   pid 为顶级节点的 pid
 * @param data
 */
  generateTree(data: any, pid: any) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].pid === pid) {
        temp = this.generateTree(data, data[i].id);
        if (temp.length > 0) {
          data[i].children = temp;
        }
        result.push(data[i]);
      }
    }
    return result;
  },

  generateTreePar(data: any, pid: any) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === pid) {
        temp = this.generateTreePar(data, data[i].id);
        if (temp.length > 0) {
          data[i].children = temp;
        }
        result.push(data[i]);
      }
    }
    return result;
  },


  buildTree(data: Array<any>, pid: string): any {
    let temp: any;
    const tree: any = [];
    data.forEach(item => {
      if (item.pid === pid) {
        temp = this.buildTree(data, item.id);
        if (temp.length > 0) {
          item.children = temp;
        } else {
          delete item.children;
        }
        tree.push(item);
      }
    });
    return tree;
  },



  /**
   * 去重 去除集合中重复元素
   */
  uniqArray(arr: any) {
    const result = [], hash = [];
    for (let i = 0, elem; (elem = arr[i]) != null; i++) {
      if (!hash[elem]) {
        result.push(elem);
        hash[elem] = true;
      }
    }
    return result;
  },

  /**
   * 差集 求两个集合差集
   */
  arrayDifference(array1: [], array2: []) {
    const clone = array1.slice(0);
    for (let i = 0; i < array2.length; i++) {
      const temp = array2[i];
      for (let j = 0; j < clone.length; j++) {
        if (temp === clone[j]) {
          clone.splice(j, 1);
        }
      }
    }
    return this.uniqArray(clone);
  }
};
