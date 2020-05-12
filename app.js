var express =require("express")
const bodyparser=require("body-parser")
const app=express();
var mongoose=require("mongoose")
var mongo=require("mongodb")
app.set('views', './views');
app.set('view engine', 'ejs');

var url="mongodb://localhost:27017/project"

mongoose.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true })
const db=mongoose.connection; 
db.once('open', function(callback){ 
    // console.log(db.collections.find())
    console.log("connection succeeded"); 
})


app.get('/',function(req,res){ 
    res.set({ 
        'Access-control-Allow-Origin': '*'
        }); 
    res.redirect('signup.html')
     
    }).listen(8080)
    console.log("server on");

    app.use(bodyparser.json());
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));



app.post('/sub',function(req,res)
{
    var uid=req.body.uid;
    var pass=req.body.pass;
    var mail=req.body.mail;
    var phn=req.body.num;
    var data=
    {
        USERNAME:uid,
        PASSWORD:pass,
        EMAIL:mail,
        PHONENUM:phn
    };
   
    db.collection("user").insertOne(data,function(err,collection)
    {
        if(err)
        throw err;
        console.log("data updated successfully");
    })
            res.redirect('/listuser');
    
});
app.post('/update/:id',function(req,res)
{
    var tid=req.params.id;
    var id=mongo.ObjectID(tid);
    var uid=req.body.uid;
    
    var mail=req.body.mail;
    var phn=req.body.num;
    var data=
    {
        USERNAME:uid,
        
        EMAIL:mail,
        PHONENUM:phn
    };
    db.collection('user').updateOne({_id:id},{$set :data},function(err,result)
    {
        res.send('<h1><a href="/listuser" id="dfd"><u>CLICK HERE TO SEE ALL USERS</u></a></h1>')
    })
   
});

app.get('/listuser',function(err,res)
{
    db.collection('user').find({}).toArray(function(err,arr)
    {
        if(!err)
        res.render('listuser',{data: arr});
      // res.redirect('login.html');
    })
});
app.get('/edit/:id',function(req,res)
{
        const ide=req.params.id;
    var id=require('mongodb').ObjectID(ide);
   // console.log(id.USERNAME);
    db.collection('user').findOne({_id:id},function(err,result)
    {
       if(!err)
      {
          //  console.log(result);
            res.render('update',{data: result});
        }
    })
});
app.get('/delete/:id',function(req,res)
{
    var tid=req.params.id;
    var id=mongo.ObjectID(tid);
    db.collection('user').deleteOne({_id:id},function(err,resp)
    {
        res.send('<h1><a href="/listuser" id="sds"><u>RECORD DELETED CLICK TO SEE UPDATED LIST</u></a></h1>');
    })
});
