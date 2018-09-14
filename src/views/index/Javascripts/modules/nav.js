//定义nav函数
const nav=() =>{  //改为箭头函数后 压缩文件也会变成箭头函数，此时需要进一步将es6转成es5
	console.log('nav');
}

//暴露nav函数  暴露的时候module.exports的值是什么，引入的时候require函数的返回值就是什么
module.exports=nav;