var express=require('express')
var bodyParser=require('body-parser')

var app=new express();
var router=require('./router')
//配置模板引擎  ejs
app.set('view engine','ejs')
//静态资源  public为静态资源文件夹
app.use(express.static('public'))
app.use(express.static('upload'))

//配置路由  路由模块化
app.get('/',router.index)
app.get('/upload',router.upload)
app.get('/show',router.show)
app.get('/add',router.add)
app.get('/del',router.del)
//获取图片
app.get('/getPicture',router.getPicture)
//创建相册
app.get('/addPicture',router.addPicture)
//删除相册
app.get('/delPicture',router.delPicture)
//上传图片
app.post('/uploadPicture',router.uploadPicture)
// 中间件转换
app.use(bodyParser.urlencoded({expanded:false}))

//处理404问题 通过中间键处理，最后处理，
//第一个参数不写匹配 任何路由
// app.use(function(req,res){
//     res.send('错误')
// })
app.use(router.error)


//配置路由端口 ip
app.listen(3000,'127.0.0.1')