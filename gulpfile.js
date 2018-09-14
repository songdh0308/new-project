//引入gulp文件
const gulp = require("gulp");

//引入全局配置  -- -因为是模块，index后不用加.js了
const config =require("./config");  //因为存在index.js里，所以可以省略 --默认找index.js   ./必须加
const htmlmin = require("gulp-htmlmin");  //引入压缩html的包
//引入热更新
const connect = require("gulp-connect");

//引入css中合并concat,压缩cssmin,添加前缀autoprefix，重命名rename
const concat =require("gulp-concat");
const cssmin =require("gulp-cssmin");
const autoprefixer =require("gulp-autoprefixer");
const rename =require("gulp-rename");

//使用合并流工具  使用merge-stream
const merge =require("merge-stream");
//引入小型webpack
const webpack = require("webpack-stream");
//引入gulp-inject 工具
const inject =require("gulp-inject");
//引入编译sass的工具
const sass=require("gulp-sass");

//需求1：压缩html文件  ---百度
//处理html，将src中的html文件输入到dist文件夹中去
 gulp.task("handle:html",function(){    //布置任务  --handle:html 任务名 
 	return gulp.src("./src/views/*/*.html")     //找文件  文件路径  src前可以return
 	      // .pipe(htmlmin(config.htmloptions))       //操作htmlmin  --参数变成对象.--
 	       .pipe(gulp.dest("dist"));   //输送文件并创建目标文件夹
 })
 
 //需求2：处理css：合并，压缩，前缀，输出
 gulp.task("handle:css",function(){
 	// 1. 希望可以合并成多个css，更灵活  2. 多页面灵活处理
    let streams = [] //存放下面多个文件流的数组
    for(const page in config.cssoptions){  //遍历多个页面  page---index，list页面
    	for(const file in config.cssoptions[page]){ //遍历各个页面中的多个打包css文件配置      file--common，index，list
    		
 	 let stream=gulp.src(config.cssoptions[page][file]) //需要打包的css文件目录（gulp流的源头）  stream存放一个流文件
 	 
 	 //把sass编译成css
 	   .pipe(sass({outputStyle: 'compressed'}))     //加{outputStyle: 'compressed'}参数可自动压缩
        .pipe(concat(file+'.css')) //通过concat将css文件拼接成一个叫做.css的文件    file表示全局配置中要合并的文件名
       // .pipe(cssmin()) //通过cssmin将上一步骤生产出的index.css去掉中间的空白，使他变成压缩格式
        .pipe(autoprefixer({// 自动加前缀
                    browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],//last 2 versions- 主流浏览器的最新两个版本
                    cascade: false, //是否美化属性值 默认：true 像这样：
                    //-webkit-transform: rotate(45deg);
                    //        transform: rotate(45deg);
                    remove:true //是否去掉不必要的前缀 默认：true 
                }))
        .pipe(rename({
            suffix: '.min' //rename只是给上一步骤产出的压缩的index.css重命名为index.min.css
        }))
        .pipe(gulp.dest('./dist/'+page+'/css')) //dest方法把上一步骤产出的index.min.css输出到“./dist/要生成的文件名称/css”目录下（gulp流的终点）
        streams.push(stream)   //把当前的文件流存储到数组中
    	}
    }
    return merge(...streams)  //合并多个文件流   ...展开streams数组
                       //...es6中的展开运算符
 })
 
 //需求3：处理js  es6--es5  合并（模块化组合--用工具处理 src--js打包到 dist中） 压缩
 //处理模块化工具  gulp-webpack   改名为webpack-stream   需下载
 gulp.task('handle:js',function(){
 	let streams = []   //存放多个js流文件
    for (const page in config.jsoptions) {   //page  ---'index'  'list'
        //判断如果入口是数组或者是字符串的话就是单出口，否则是多出口（与入口相同名）
        let entry = config.jsoptions[page]
        let filename = Array.isArray(entry) || ((typeof entry) === 'string') ? page : '[name]'          //Array.isArray(entry)判断entry是否是数组
        let stream = gulp.src('src/entry.js')  //stream接收单个js文件
            .pipe(webpack({
                mode: 'production',
                entry:entry ,
                output: { filename: filename+'.min.js' },   //出口的文件名取决于是单出口还是多出口
                module: {
                    rules: [ //webpack中在这里使用各种loader对代码进行各种编译
                        {
                            test: /\.js$/, // 对js文件进行处理
                            loader: 'babel-loader', // 使用babel-loader对其进行处理   版本需为7.0.0  @7.0.0--选择版本
                            query: {
                                presets: ['es2015'] // 将es6编译一下
                            }
                        }
                    ]
                }
           }))
            .pipe(gulp.dest('./dist/' + page + '/js'))
            streams.push(stream)
    }
    return merge( ...streams )  //合并多个流文件
 })
 
 /*初步处理js
 	return gulp.src('./src/entry.js')
 	        .pipe(webpack({     //真正的处理
 	        	mode:"production",  // 设置打包模式： none development production(会压缩代码)
 	        	
 	        	//单入口，单出口  src: index.js---dist:index.js
 	        	entry: './src/views/index/javascripts/index.js',   //入口--源文件目录
 	        	output:{    //出口  ---名字自定义
 	        		filename:'index.js'
 	        	}
 	        	
 	        	//多入口（兄弟文件）,数组存放（谁在前打包时也在前），单出口    
 	        	entry: ['./src/views/index/javascripts/index.js','./src/views/index/javascripts/vandor.js'],   //入口--源文件目录
 	        	output:{    //出口  ---名字自定义
 	        		filename:'index.js'
 	        	}
 	        	
 	        	//多入口 多出口
 	        	entry: {   //对象
 	        		index:'./src/views/index/javascripts/index.js',
 	        		vandor:'./src/views/index/javascripts/vandor.js'
 	        	},
 	        	output:{    //出口  ---名字自定义
 	        		filename:'[name].min.js'              //[name]表示与入口键的名字对应
 	        	}
 	        	
 	        }))
 	        .pipe(gulp.dest('./dist/index/js'))    //js自动生成*/
 
 //需求4：利用gulp-inject 工具自动的在html页面中注入css/js依赖
 gulp.task('inject', function () {    //操作名
 	setTimeout(function(){   //让css，js等先执行
 		config.pages.forEach(page =>{   //循环数组取出对应页面  page---表示页面名
 			var target = gulp.src('./dist/'+page+'/'+page+'.html');      //操作的源文件夹  --
 			// It's not necessary to read the files (will speed up things), we're only after their paths:
 			var sources = gulp.src(['./dist/'+page+'/js/*.js', './dist/'+page+'/css/*.css'], {read: false});     //要注入的js、css
 
 			return target.pipe(inject(sources,{ignorePath:'/dist'}))   //忽略自动生成的文件同级文件名
 			  .pipe(gulp.dest('./dist/'+page+''));   //注入到的html页面的最终路径
 		})
 	},2000);
});
 //需求5：在项目中准备使用sass来代替css，所以需要使用gulp-sass来对sass进行编译，需要下载node-sass/gulp-sass
 
 //监听函数
 gulp.task("watch",function(){
 	gulp.watch("./src/views/*/*.html",["handle:html","inject","reload"])
 	gulp.watch("./src/**/*.scss",["handle:css","inject","reload"])  //**找所有子代页面
 	gulp.watch("./src/**/*.js",["handle:js","inject","reload"])  //**找所有子代页面
 })
//配置热更新服务器，利用gulp-connect
gulp.task("sever",function(){
	connect.server(config.severoptions)
})
 //服务器即时刷新
 gulp.task("reload", function(){
	return gulp.src("./dist/**/*.html")
		.pipe(connect.reload());
})

 //默认任务 ---先执行handle:html  再执行watch
gulp.task("default",["sever","handle:html","handle:css","handle:js","inject","watch"])

//在package.js更改npm start启动模式  --输入npm start即可运行


