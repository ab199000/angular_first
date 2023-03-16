const express = require("express");
const app = express();
const cors = require('cors')     
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload'); 
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
// const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");




(async () => {
    try {
        await mongoClient.connect();
        app.locals.collection = mongoClient.db("postDb").collection("posts");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }catch(err) {
        return console.log(err);
    } 
})();

app.use(fileupload())
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//     extended:true,
//     limit: '50mb'
// }));
app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    next();  
})
  
app.get("/posts/getPosts", async(req, res) => {
    console.log(2);
    const collection = req.app.locals.collection;
    try{
        const posts = await collection.find({}).toArray();

        res.send(posts);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

     
app.post("/posts/addPost", async(req, res)=> {
    console.log(1);
    let file,prefix;
    if(!req.body) return res.sendStatus(400);console.log(req)
    file = req.files.file;
    console.log(file)
    // console.log("картинка ",req.files.img)
    console.log("body ", req.body)
    console.log("files ", req.files)

    // console.log(file)
    // console.log("req", req)
    // console.log("res", res)
    prefix = `data:image/${file.name.split(".")[file.name.split(".").length - 1]};base64`;
    const postTitle = req.body.title;
    const postContent = req.body.content;
    const postImg = {
        base64Img : file.data,
        imgName : file.name,
        prefix : prefix
    }


    const post = {title: postTitle, content: postContent,isEdited:false,img:postImg};
         
    const collection = req.app.locals.collection;
    console.log(post);
    try{
        await collection.insertOne(post);
        res.send(post);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.delete("/posts/deletePost/:id", async(req, res)=>{
          
    const collection = req.app.locals.collection;
    try{
        const id = new objectId(req.params.id);
        const result = await collection.findOneAndDelete({_id: id});
        const post = result.value;
        if(post) res.send(post);
        else res.sendStatus(404);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});
     

// app.get("/api/users/:id", async(req, res) => {
          
//     const collection = req.app.locals.collection;
//     try{
//         const id = new objectId(req.params.id);
//         const user = await collection.findOne({_id: id});
//         if(user) res.send(user);
//         else res.sendStatus(404);
//     }
//     catch(err){
//         console.log(err);
//         res.sendStatus(500);
//     }
// });
      

app.put("/posts/editPost", async(req, res)=>{
    let file,prefix;
    if(!req.body) return res.sendStatus(400);
    
    const postTitle = req.body.title;
    const postContent = req.body.content;
    file = req.files.file;
    prefix = `data:image/${file.name.split(".")[file.name.split(".").length - 1]};base64`;
    const postImg = {
        base64Img : file.data,
        imgName : file.name,
        prefix : prefix
    }
    console.log(postImg,"file")
    const collection = req.app.locals.collection;
    try{
        const id = new objectId(req.body.id);
        console.log(postImg,"file")
        const result = await collection.findOneAndUpdate({_id: id}, { $set: {title: postTitle, content: postContent, img:postImg}},
         {returnDocument: "after" });
 
        const post = result.value;
        if(post) res.send(post);
        else res.sendStatus(404);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});
   
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async() => {
      
    await mongoClient.close();
    console.log("Приложение завершило работу");
    process.exit();
});