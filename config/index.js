//全局配置 
const config = {   //压缩html的配置
	htmloptions: {
		removeComments: true,//清除HTML注释
		collapseWhitespace: true,//压缩HTML
		collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
		minifyJS: true,//压缩页面JS
		minifyCSS: true//压缩页面CSS
	},
	severoptions:{
		root: "./dist",
		livereload: true,
		port: 8000
	},
		cssoptions: {// css配置
	    'index': { // index页面的css
	        'common': [ // index页面处理之后的common.min.css需要合并的文件  reset 和 common里的css合并
	            './src/stylesheets/reset.scss',
	            './src/views/index/stylesheets/common/*.scss'
	        ],
	            // index页面处理之后的index.min.css需要合并的文件
	        'index': './src/views/index/stylesheets/index/*.scss'
	    },
	    'list': {
	        'list': [     //reset与list里的css的合并
	            './src/stylesheets/reset.scss',
	            './src/views/list/*/*.scss'
	        ]
	    }
	},
	jsoptions:{   //js配置
		'index':{      //多入口
				index:'./src/views/index/javascripts/index.js',
				vandor:'./src/views/index/javascripts/vandor.js'
		},
		'list': './src/views/list/javascripts/list.js'
		
	},
	pages:["index","list","car"]    //页面配置  .html
 };
    
//把config暴露出去，是为了在其他地方使用，只能暴露一次，如果多个可以用数组表示
module.exports =config;      //多个配置[config,a,b];
