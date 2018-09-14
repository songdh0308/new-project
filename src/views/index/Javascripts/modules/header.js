//在header中引入nav
const nav =require('./nav')
//注意：模块中的对象，变量等都是私有的，不能单纯的直接在其他页面引用，若需要使用，必须在模块中暴露出来
nav()
console.log("header");
