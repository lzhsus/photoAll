var express=require('express')
var fs=require('fs')
var app=new express()
app.get('/aaa',007,function(req,res){
    
    fs.unlink('./upload', (err)=>{
        if(err){
            res.send(err)
        }
        res.send('ok')
    })
})
app.listen(3001,'127.0.0.1')