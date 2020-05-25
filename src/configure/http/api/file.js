/**
 *@Author hi dbin
 *@Date 2020/5/25 13:45
 **/

export default function(http){
    return {
        queryByPage(data) {
            return http.json({
                url: "/api/oss/file/query",
                data
            });
        },
        getInfo(data) {
            return http.json({
                url: "/api/oss/file/get",
                data
            });
        },
        delete(data) {
            return http.json({
                url: "/api/oss/file/delete",
                data
            });
        },

        saveInfo(data) {
            return http.json({
                url: "/api/oss/file/dir/create",
                data
            });
        },

        upload(data) {
            return http.json({
                url: "/api/oss/{bucket}",
                data
            });
        },
    }
}
