const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const path = require("path");

const multer = require("multer");

//npm init para agregar las principales dependencias
//se instala nodemon npm add nodemon para que sea en tiempo real los cambios
//se instalo para obtener las imagenes npm add multer -> Firebase,AWS
//para inciar esta api se escribe node index.js(archivo inicial)
//npm add path para las imagenes

dotenv.config();
app.use(express.json()); //ayuda a que se puedan enviar archivos json
app.use("/images",express.static(path.join(__dirname,"/images")));

//se instalo npm add bcrypt para encriptar el password del user por seguridad

mongoose.connect(process.env.MONGO_URL)
.then(console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));

const storage = multer.diskStorage({
   destination:(req,file,cb) =>{
    cb(null,"images");
   },filename:(req,file,cb)=>{
    cb(null,req.body.name);
   }
});

const upload = multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("File has been uploaded");
})

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);

app.listen("5000",()=>{
    console.log("Backend is running");
})
