/**
 * Created by litao on 2018/10/25.
 */
export default function (redirect) {

    const load = require('./import/_import_' + process.env.NODE_ENV);

    return {
        other: [
            {
                name: 'error',
                path: '/error/:errorPageRoute?',
                props: true,
                component: load('views/error/index'),
                meta: {permissionCode: '*'}
            },
            {
                name: 'noAuthority',
                path: '/authority/401',
                props: true,
                component: load('views/error/no-authority'),
                meta: {permissionCode: '*'}
            }
        ],
        permission: [
            {
                name: '/',
                path: '/',
                component: load('views/layout/index'),
                redirect,
                children: [
                    {
                        name: 'index',
                        path: 'index',
                        component: load('views/index/index'),
                        meta: {title: '首页', permissionCode: 'index', icon: 'icon-zhuye'}
                    },
                    {
                        name: 'bucket',
                        path: 'bucket',
                        component: load('views/oss/bucket/list'),
                        meta: {title: '系统设置', permissionCode: 'bucket', icon: 'icon-bucket'}

                    },
                    {
                        name: 'file',
                        path: 'file',
                        component: load('views/oss/file/list'),
                        meta: {title: '系统设置', permissionCode: 'file', icon: 'icon-file'}

                    }
                ]
            }
        ]
    }
}
