//exports 数据抛出
var fs=require('fs')
var formidable=require('formidable')
var path=require('path')

//首页
exports.index=function(req,res){
    // 定义相册的名称
    var dirList=[]
    var imgList=[]
    fs.readdir('./upload',(err,files)=>{
        //判断是否是文件夹  forEac循环变量文件数组
        files.forEach((value,index)=>{
            //判断文件状态  
            //参数1：文件路径
            //参数2：回调
            fs.stat('./upload/'+value,(err,stats)=>{
                // 判断是否是文件夹  stats.isDurectory()文件夹返回true
                if(stats.isDirectory()){
                    //是文件夹 添加到数组
                    // 相册名称 添加成数组
                    dirList.push(value)
                    fs.readdir('./upload/'+value,(err,files)=>{
                        // if(files[0]==undefined){
                        //     console.log('相册是空的')
                        // }else{
                        //     imgList.push(files[0])
                        // }
                        imgList.push(files[0])
                    })
                }
                //如果结束，直接渲染
                if(index==files.length-1){
                    res.render('index',{dirList,imgList})
                }
            })

        })
        // res.render('upload',{dirList}) 
    })
}
// 获取相册名称 数组
exports.upload=function(req,res){
    getdirName(res,'upload')
}
//上传图片 选择图片  post数据处理
exports.uploadPicture=function(req,res){
    var form=new formidable.IncomingForm();
    // ..图片存放路径
    form.uploadDir='./upload'
    //parse方法解析提交的数据
    //fields   提交的文本数据组 代表文本内容
    //files  提交的二进制文件
    form.parse(req,function(err,fields,files){
       //图片上传失败
       if(err){res.end(err)}
        //对原文件进行改名
        // __dirname：全局变量，存储的是文件所在的文件目录
        // 随机数+时间戳 
        var oldpath = __dirname + "/" + files.picture.path;
        // 一元加 返回毫秒 数
        var time = +new Date();
        // 生产随机数  千位数
        var random = parseInt(Math.random() * 10000);
        // 获取图片的拓展名 .jpg .png .gif
        var extname = path.extname(files.picture.name);
        // 新的文件名
        //fields.dirname  选择不同的相册名称保存
        var newpath = __dirname + "/upload/"+fields.dirname+'/' + time + random + extname;
        fs.rename(oldpath,newpath,(err)=>{
            res.writeHead(200,{'Content-type':'text/html;charset=utf-8'})
            if(err){res.send(err)}
            res.send('<a href='/'>返回首页</a>')
        })
    })
}
//查看 forEach 遍历
exports.getPicture=function(req,res){
    var dirList=[]
    fs.readdir('./upload/'+req.query.dirname,(err,files)=>{
        //判断是否是文件夹  forEac循环变量文件数组
        files.forEach((value,index)=>{
            //判断文件状态  
            //参数1：文件路径
            //参数2：回调
            fs.stat('./upload/'+req.query.dirname+'/'+value,(err,stats)=>{
                // 判断是否是文件夹  stats.isDurectory()文件夹返回true
                if(stats.isFile()){
                    //是文件夹 添加到数组
                    dirList.push(value)
                }
                //如果结束，直接渲染
                if(index==files.length-1){
                    res.send({dirList})
                }
            })

        })
        // res.render('upload',{dirList}) 
    })
   
}
//创建相册  
exports.addPicture=function(req,res){
    // req.rquery.picName  获取要创建的文件的文件名
    fs.mkdir('./upload/'+req.query.picName,(err)=>{
        if(err){
            res.send(err)
        }
        res.send('<h4>创建成功</h4><h5><a href="/">返回首页</a></h5>')
    })
}
//删除图片
exports.delPicture=function(req,res){
    var delName=req.query.delName
    var path='./upload/'+delName
    var files = [];
    // 判断 文件夹是否存在
	if(fs.existsSync(path)) {
        //返回指定文件夹里面的数据
        files = fs.readdirSync(path);
        if(files.length!=0){
            files.forEach(function(file,index){
                var delPath=path+'/'+file;
                if(fs.statSync(delPath).isDirectory()){
                    // 删除文件夹
                    deleteall(delPath);
                }else{
                    // 删除文件
                    fs.unlinkSync(delPath);
                }
                if(index==files.length-1){
                    fs.rmdirSync(path);
                    res.send('相册已删除')
                }
            })
        }else{
            fs.rmdirSync(path);
            res.send('空相册，已删除')
        }
	}else{
        res.send('<h2>文件名输入有误，请重新输入<a href="/del">重新输入</a></h2>')
    }
    
    
}
exports.show=function(req,res){
    getdirName(res,'show')
}
exports.add=function(req,res){
    res.render('add',{})
}
exports.del=function(req,res){
    res.render('del',{})
}
exports.error=function(req,res){
    res.render('404',{})
}

// 获取相册名称 数组
function getdirName(res,path){
    var dirList=[]
    fs.readdir('./upload',(err,files)=>{
        //判断是否是文件夹  forEac循环变量文件数组
        files.forEach((value,index)=>{
            //判断文件状态  
            //参数1：文件路径
            //参数2：回调
            fs.stat('./upload/'+value,(err,stats)=>{
                // 判断是否是文件夹  stats.isDurectory()文件夹返回true
                if(stats.isDirectory()){
                    //是文件夹 添加到数组
                    dirList.push(value)
                }
                //如果结束，直接渲染
                if(index==files.length-1){
                    res.render(path,{dirList})
                }
            })

        })
        // res.render('upload',{dirList}) 
    })
}