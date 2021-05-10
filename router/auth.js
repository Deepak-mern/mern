const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
// // const authenticate = require("../middleware/authenticate")
router.use(cookieParser())
require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send(`hello world form server router`);
});























router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz fill the fields properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "passwords are not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      await user.save();
      res.status(201).json({ message: "user registered sucessfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// login route

router.post("/signin", async (req, res) => {
  // console.log(req.body);
  // res.json({message: "awesome"});
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "plz filled the data" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);

    if(userLogin){

      const isMatch = await bcrypt.compare(password, userLogin.password)

      token = await userLogin.generateAuthToken();
      console.log(token);


      res.cookie("jwtoken",token,{
        expires:new Date(Date.now() + 25892000000),
        httpOnly:true

      });


      if (!isMatch) {
        res.status(400).json({ error: "Invalid Crendtials" });
      } else {
        res.json({ message: " user Signin  Sucessfully" });
      }
    }else{
       res.status(400).json({error:"Invalid Crendtials"})

    }


  } catch (err) {
    console.log(err);
  }
});


const Authenticate = async (req, res, next)=>{
  try{
    
      const token = req.cookies.jwtoken;
      const verifyToken =  jwt.verify(token, process.env.SECRET_KEY)
     
       const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});
       if(!rootUser){throw new Error('User not Found')}
           req.token = token;
           req.rootUser = rootUser;
           req.userID = rootUser._id;
           next();
     

   }catch(err){
       res.status(401).send('UNauthorized: No token provided')
       console.log(err)

   }
 }








// about uslient
router.get("/about",Authenticate,(req, res) => {
 res.send(req.rootUser);
});

router.get('/getdata',Authenticate,(req,res)=>{
  res.send(req.rootUser)

})

router.post("/contact",Authenticate,async (req, res) => {
  try {
    const {name, email,phone,message}=req.body;
    if(!name|| !email||  !phone|| !message){
      console.log("error in contact form")
      return res.json({error:"plzz filled the contact form"})
  } 
  const userContact = await User.findOne({_id:req.userID});
  if(userContact){

    const userMessage = await userContact.addMessage(name,email,phone,message);

     await userContact.save();
     res.status(201).json({message: "user Contact Sucessfully"})
  }
}catch (error) {
    console.log(error)
    
  }
  

 });

 router.get("/logout",(req, res) => {
console.log(`hello my logout page`);
res.clearCookie ('jwtoken',{
  path:'/'
});
res.status(200).send(`User Logout`)
});

module.exports = router;
