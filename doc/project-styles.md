# 工程规范（必读）

### 1、基础规范

文件需要注释，需要描述出具体作用、使用规则、作用对象、方法描述、参数描述。

``` js
/**
* 文档作用描述
*
*/
export default {
    /**
     * 根据事件id获取其子事件
     * get
     * @param {string} eventId 事件类型id
     * @returns {Promise<any>}
     */
    QueryByEventId(eventId: string): Promise<any> {
        const planPreparationUrl = store.getters.configs.planPreparationUrl;
        const url = stringFormat(`${planPreparationUrl}${eventTypeUrl.QueryByEventId}`, eventId);
        return httpClient.postPromise(url);
    }

}
```

### 2、src/api文件层次结构：

* 能力/模块/业务 保持三级目录结构
* 命名小写、中杠隔开、文件后面需要带service

``` ts
如：api/template-manage/template-manage-service.ts
```

### 3、文件内引用分级

* node_modules基础引用
* @gsafety包引用
* 模块引用

``` js
例如：
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Getter } from 'vuex-class';
import { stringFormat } from "@gsafety/cad-gutil/dist/stringformat";
import eventNames from "@/common/events/store-events";
import styles from "./template-list.module.scss";
import { ElNotificationOptions } from 'element-ui/types/notification';
```

### 4、common\events 公共事件定义

* 所有的组件自定义的事件都定义在component-events.ts中
    * 按照业务组件来划定事件定义区域, 业务组件以首字母小写的驼峰命名方式
    * 自定义事件名称以首字母小写的驼峰命名方式
    * 自定义事件实际名称以全字母小写加横杠的命名方式（这是由于vue在进行template处理时，会将自定义事件名称转化为纯小写）
* 所有的VUEX的事件都定义在store-events.ts中，命名规则为：全大写英文单词+下划线连接
* 如果使用了vuex共享状态管理，不推荐再用eventbus进行事件发布和订阅

``` js 组件事件定义

export const ComponentEvents = {
    quickChoose: {
        onConditionChanged: 'on-condition-changed',
        onClearConditions: 'on-clear-conditions',
    }
}

```

``` js VUEX事件定义

export const StoreEvents = {

    TemplatesMgr: {
        LOAD_TEMPLATES: 'LOAD_TEMPLATES',
        SORT_TEMPLATES: 'SORT_TEMPLATES',
        SET_TEMPLATES: 'SET_TEMPLATES'
    },
}


```

### 5、注释整体原则  

不要为了注释而注释, 应该想尽办法不去写注释。

* 类/成员变量/成员方法应该优先考虑起一个有意义的名字(见名知意), 一个好名字比任何注释都有用, 不要害怕名字长, 长而有意义的名字比短而令人费解的名字好; 
* 应该优化代码结构, 将一些相同功能的代码抽取成方法, 然后起个好名字, 同一个方法内的代码不应该超过80行, 越短越好; 
* 不要试图起一个差的名字, 然后用好的注释去弥补. 好代码(名字) > 坏代码(名字) + 好注释

### 6、常量一定要加注释

常量一般是对一些魔法值的抽取, 然后起一个有意义的名字, 做到见名知意, 这里建议对于这种const修饰的常量, 使用全大写命名, 多个单词 _ 分隔

### 7、目录及组件命名  

* 目录名及组件文件名应有意义, 且尽量简短, 如:

``` 示例

template-manager/template-list/template-list.ts
template-manager/template-manager.ts

```

* 如果当前组件目录下不存在子目录，则组件文件名应该和组件目录名保持一致，且组件目录下至少包含三个文件，分别为：ts,html,scss, 如：

``` 示例

components
├── error
│   ├── error.module.scss  组件所使用到的局部样式
│   ├── error.html 组件对应的页面模板内容
│   └── error.ts 组件对应的操作逻辑类

```

* 组件class名和文件文件名严格一致(class名大驼峰, 文件名 - 分隔), 如:

``` 示例

template-manager.ts

@Component
export default class TemplateManager extends Vue {}

```

* 如果组件目录下存在子目录，则嵌套层级最多不能超过三级，如：

``` 示例

components/template-manager/template-list/filter/  最大目录层级

```

### 8、路由命名  

* 组件引入使用按需加载，需要注明webpackChunkName，引入时定义的名称和组件class名相同
* 路由路径名采用rest风格, 多个单词使用 - 连接;
* 当为多级路由, 且父路由仅用于加载Layout布局时, 其path名应该同子组件的父目录名一致;
* 路由的name命名为大驼峰, 其后缀正常应该与路由的Path保持一致, 如:

``` 示例

组件目录：components/template-manager/template-list/

  {
    path: '/template-manager',  // 警情相关, 由于此处path对应的组件为Layout,仅加载布局用,所以为了和下面的子路由产生一定的关联性,这里使用父级目录名incident作为path
    component: Layout,
    redirect: 'noredirect',
    name: 'TemplateManager',
    icon: 'zujian',
    hidden: true,
    children: [
      {
        path: 'template-list',  // 模板详情, 对应目录名template-list
        component: () => import(/* webpackChunkName: "TemplateList" */  '../components/template-manager/template-list/template-list.ts'),
        name: 'TemplateList',
        icon: '',
        children: []
      }
    ]
  }

```
