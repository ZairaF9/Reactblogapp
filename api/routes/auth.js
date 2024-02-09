const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//REGISTER
//post -> creating something
//put -> update existing model
//get -> fetching data
//delete -> delete data

//req -> lo que enviamos al servidor
//res -> lo que recibimos como respuesta del servidor

router.post("/register",async(req,res)=>{
    try{
        //te ayuda a encriptar la contraseña del usuario nuevo
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);

        const newUser = new User({ //se crea el usuario en base al modelo
            username:req.body.username,
            email:req.body.email,
            password:hashedPass,
        })

        const user = await newUser.save(); 
        res.status(200).json(user);
        //se coloca await ya que se usa una función async
        //.save() es una función de mongo

    }catch(err){
        res.status(500).json(err);
    }
}); 


//LOGIN

router.post("/login",async(req,res)=>{
    try{
       const user = await User.findOne({username:req.body.username});
       !user && res.status(400).json("Wrong credentials");

       const validated = await bcrypt.compare(req.body.password,user.password);
       !validated && res.status(400).json("Wrong credentials");

        const{password,...others} = user._doc;
        res.status(200).json(others);

    }catch (err){
       res.status(500).json(err);
    }
});

module.exports = router;