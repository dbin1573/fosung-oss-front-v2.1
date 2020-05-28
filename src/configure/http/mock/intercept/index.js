/**
 * key is request URL
 * value is response handler function
 * @type {{}}
 */
export default Object.assign([
    '/user/configure',
    '/user/info',
    '/logout',


    '/api/file/list',
].reduce((result, url) => Object.assign(result, { [url]: request => generateResponseResult(url, request) }), {}), {});

const exDataMap = {

};

const pageUrlList = [ //在此处加上分页类型的url
];

function generateResponseResult(path, request, { success = true, code = 200, message } = {}) {
    let data = undefined;

    try {
        data = require(`../response${path}`).default;

        if(data && typeof data === 'function') data = data(JSON.parse(request.body || "{}"));
    } catch (e) {
        console.log(`未找到mock返回文件，默认返回空对象 ===> ${path}`);
    }

    return Object.assign({}, {
        success,
        code,
        message,
        exData: exDataMap[path]
    }, pageUrlList.includes(path) ? data : {
        data
    });
}
