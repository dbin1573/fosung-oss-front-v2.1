/**
 * Created by litao on 2018/10/25.
 */
export default function (context, router, to, from, next) {
    let whitePermissionCodeList = ['index'],
        $vm = context.$vue.prototype,
        $api = $vm.$api,
        $store = context.$store,
        isLogin = context.utils.objectNotEmp($store.getters.userInfo);

    if(to.meta && to.meta.permissionCode === '*'){
        next();
    }else{
        if(isLogin){
            next();
        }else{
            let maskId = $vm.$openMask(document.body, '正在加载配置...');

            //获取配置
            $api('user', 'getConfigure').then(({ data }) => {
                if(data){
                    let { loginUrl, logoutUrl } = data || {};

                    //必须配置登录/登出路径
                    if(loginUrl && logoutUrl){
                        $store.commit('SET_OTHER_INFO', {
                            key: 'frontConfig',
                            value: data || {}
                        });

                        //关闭全部遮罩
                        $vm.$closeAllMask();

                        maskId = $vm.$openMask(document.body, '正在获取用户...');

                        //获取用户信息
                        $api('user', 'getCurrentUser').then(({ data }) => {
                            if(data && data.roleList && data.roleList.length >= 0){
                                $store.commit('SAVE_USER', data);

                                loadSourceByRole(data);

                                $vm.$busListener('router.permission.reload', () => loadSourceByRole(data, false));
                            }else{
                                maskId && $vm.$closeMask(maskId);

                                next({ name: 'noAuthority' });
                            }
                        }, error => requestErrorHandler(error, '获取当前用户失败，请稍后重试！'));
                    }else{
                        requestErrorHandler(data, '服务器未配置登录/登出路径，请检查！');
                    }
                }else{
                    requestErrorHandler(data, '服务器异常，加载配置失败，请稍后重试！');
                }
            }, error => requestErrorHandler(error, '服务器异常，加载配置失败，请稍后重试！'));

            //加载配置异常时的处理
            function requestErrorHandler (error, message){
                $vm.$error(message);

                maskId && $vm.$closeMask(maskId);

                error && console.log(error);
            }

            function loadSourceByRole (userInfo, addRouter = true){
                let serverMenus = require('../http/mock/response/sys/resource/navigate').default || [];

                if(serverMenus && serverMenus.length > 0){
                    let permissionMenus = $store.getters.menuInfo.permissionMenus || [];
                    let otherMenus = $store.getters.menuInfo.otherMenus || [];

                    if(permissionMenus.length > 0){
                        let permissionMap = {}, indexMap = {};

                        serverMenus.forEach((item, index) => {
                            permissionMap[item.code] = item;
                            indexMap[item.code] = index;
                        });

                        let menuMap = {};

                        treeToList(permissionMenus.find(item => item.children && item.children.length > 0).children);

                        function treeToList(source) {
                            (source || []).forEach(item => {
                                if(item.name){
                                    menuMap[item.name] = item;

                                    if(item.children && item.children.length > 0){
                                        treeToList(item.children);
                                    }
                                }
                            });
                        }

                        permissionMenus[0].children = menuMerge(serverMenus);

                        function menuMerge(source) {
                            return (source || []).map(item => {
                                let mapResult = menuMap[item.code];
                                let result = Object.assign({}, item, mapResult, { children: item.children });

                                if(mapResult){
                                    result.meta = result.meta || {};
                                    result.meta.icon = item.iconSkin || result.meta.icon;
                                    result.meta.title = item.name;
                                    if(result.children && result.children.length > 0){
                                        result.children = menuMerge(result.children);
                                    }else{
                                        if(mapResult.children && mapResult.children.length > 0){
                                            result.children = mapResult.children.filter(cit => cit.meta && (whitePermissionCodeList.includes(cit.meta.permissionCode) || cit.meta.permissionCode === item.code));
                                        }
                                    }

                                    return result;
                                }
                            }).filter(item => item);
                        }

                        $store.commit('UPDATE_MENU', {
                            field: 'successMenus',
                            value: otherMenus.concat(permissionMenus)
                        });

                        addRouter && router.addRoutes(permissionMenus);
                    }
                }else{
                    $vm.$error('您没有系统权限！');
                    return;
                }

                $store.commit('UPDATE_MENU', {
                    field: 'serverMenus',
                    value: serverMenus
                });

                $vm.$closeMask(maskId);

                next(to);
            }
        }
    }
}
