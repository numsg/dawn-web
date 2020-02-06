# 工程结构说明

``` shell
pms-web
├── dist                                 构建的目标dist目录
│   ├── css
│   ├── fonts
│   ├── images
│   ├── img
│   ├── js
│   ├── themes
│   ├── config.json
│   ├── favicon.ico
│   └── index.html
├── doc                                  项目相关文档输出
├── public                               静态资源目录
│   ├── images                           静态图片
│   ├── themes                           静态样式文件
│   ├── tinymce                          富文本编辑器相关主题样式以及图片
│   ├── config.json                      应用配置信息
│   ├── favicon.ico                      站点图标
│   └── index.html                       静态主页
├── src                                  源文件目录
│   ├── api                              服务访问目录  命名约定xxx-service, 可以根据组件目录顶定义相同的目录以存放跟组件相关的服务。
│   ├── assets                           公共资源，此处资源import使用，是会被webpack打包编译的资源
│   │   ├── iconfont                         -站点字体
│   │   ├── img                              -图片
│   │   └── styles                           -全局样式文件
│   ├── common                           公共代码
│   │   ├── constants                        -常量定义
│   │   ├── directives                       -公用指令
│   │   ├── enums                            -公用枚举
│   │   ├── events                           -公用事件名称
│   │   ├── filters                          -公用过滤器
│   │   └── url                              -公用服务访问url定义
│   ├── components                       业务视图组件集，所有的业务组件和公共组件均定义在此处，每个业务组件至少包含三个文件：html, ts, scss，可以视情况增加子目录，目录层级最好不要超过3层
│   │   ├── error                        全局错误处理组件
│   │   │   ├── error.module.scss        组件样式文件，命名规则为：[组件名].module.scss
│   │   │   ├── error.html               组件对应Template, 此处采用Angular的编写思路，只保留了vue文件中的template部分
│   │   │   └── error.ts                 组件对应的逻辑处理文件，用来处理前端组件的各种操作逻辑
│   │   ├── layout                       页面布局组件, 包含了子目录，内部文件结构同上...
│   │   │   ├── app-content              应用程序内容区域，内部文件结构同上...
│   │   │   ├── app-header               应用程序头部区域，内部文件结构同上...
│   │   │   ├── navbar                   应用程序导航栏，内部文件结构同上...
│   │   │   ├── layout.module.scss
│   │   │   ├── layout.html
│   │   │   └── layout.ts
│   │   ├── login                        登录组件, 内部文件结构同上...
│   │   │   ├── login.module.scss
│   │   │   ├── login.html
│   │   │   └── login.ts
│   ├── i18n                             国际化词条，多语言文件
│   │   ├── en-US.json                       -英文词条
│   │   ├── es-EC.json                       -西语词条
│   │   ├── index.ts                         -i18n处理
│   │   └── zh-CN.json                       -中文词条
│   ├── models                           客户端实体对象, 按照component中的业务组件目录进行划分
│   ├── router                           全局路由控制
│   ├── store                            状态管理器目录，分模块
│   │   ├── modules                      分模块状态管理器
│   │   ├── getters.ts                   各模块状态state统一导出
│   │   └── index.ts                     store初始化及导出
│   ├── typings                          类型定义文件目录
│   │   ├── options.d.ts                 vue的组件选项ts声明文件
│   │   ├── shims-html.d.ts              vue的html文件的ts声明文件
│   │   ├── shims-scss.d.ts              vue的样式文件的ts声明文件
│   │   ├── shims-tsx.d.ts               tsx的ts声明文件
│   │   ├── shims-vue-class.d.ts         vuex的ts声明文件
│   │   ├── shims-vue.d.ts               vue的ts声明文件
│   │   ├── typings.d.ts                 第三方组件的ts声明文件
│   ├── utils                            通用帮助组件
│   │   ├── app-config.ts                应用配置初始化类
│   │   ├── guid.ts                      guid生成器
│   │   ├── log.ts                       日志处理
│   └── main.ts                          vue根启动入口
├── tests                                单元测试目录
│   └── unit
├── .browserslistrc                      浏览器兼容定义
├── .editorconfig                        编辑器配置
├── .gitignore                           git非版本控制定义
├── package-lock.json                    package锁定版本文件
├── package.json                         npm包配置文件
├── postcss.config.js                    css插件配置
├── README.md                            项目md文件
├── tsconfig.json                        ts配置文件
├── tslint.json                          ts静态质量检查配置文件
└── vue.config.js                        vue配置文件，vue-cli3简化了原有版本webpack相关所有配置信息，提供了默认配置，如果需要自定义部分配置，可使用此文件进行全局处理
```  
