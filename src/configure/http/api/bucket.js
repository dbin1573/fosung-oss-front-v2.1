/**
 *@Author hi dbin
 *@Date 2020/5/25 10:57
 **/

export default (http)=>{
    return {
        queryByPage(data) {
            return http.json({
                url: "/api/oss/bucket/query",
                data
            });
        },
        list (data) {
            return http.json({
                url: "/api/oss/bucket/list",
                data
            });
        },
        getInfo(data) {
            return http.json({
                url: "/api/oss/bucket/get",
                data
            });
        },
        saveInfo(data) {
            return http.json({
                url: "/api/oss/bucket/save",
                data
            });
        },
        delete(data) {
            return http.json({
                url: "/api/oss/bucket/delete",
                data
            });
        }

    }
}
