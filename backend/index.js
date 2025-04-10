require("dotenv").config();

const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const User = require("./models/user.model");
const Note = require("./models/note.model")

const express = require("express");
const cors = require("cors");

const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(400).json({ error: true, message: "Full Name is Required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is Required" });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: "Password is Required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists"
    });
  }

  const user = new User({
    fullName,
    email,
    password
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful"
  });
});

//Login
app.post("/login",async (req,res) => {
    const { email , password
    } = req.body;
    if(!email){
        return res.status(400).json({ message:"Email is Required"});
    }

    if(!password){
        return res.status(400).json({ message:"Passwod is Required"});
    }

    const userInfo = await User.findOne({ email:email});

    if(!userInfo){
        return res.status(400).json({ message: "User Not Found"})
    }

    if(userInfo.email == email && userInfo.password == password ){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        })

        return res.json({
            error:false,
            message: "Login Successful",
            email,
            accessToken,
        })
    }

    else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credential"
        })
    }

})

//get User

app.get("/get-user", authenticateToken, async(req,res)=>{
    const {user} = req.user;

    const isUser = await User.findOne({_id:user._id });

    if(!isUser){
        return res.sendStatus(401)
    }

    return res.json({
        user: {fullName: isUser.fullName, email: isUser.email, "_id":isUser.id,createdOn:isUser.createdAt },
        message:"",
    })
})

//add-notes
app.post("/add-note", authenticateToken, async (req,res) =>{
const {title,content,tags} = req.body;
const {user} = req.user;

if(!title){
    return res.status(400).json({error:true, message:" Title is Required"})
}
if(!content){
    return res.status(400).json({error:true, message:" Content is Required"})
}

try {
    const note = new Note({
        title,
        content,
        tags:tags || [],
        userId: user._id,
    });

    await note.save();

    return res.json({
        error: false,
        note,
        message:"Note Added Successfully",
    })
}
catch(error){
    return res.status(500).json({
        error:true,
        message:"Internal Server Error"
    });
}

})

//edit notes
app.post("/edit-note/:noteId", authenticateToken, async (req,res) =>{
const noteId = req.params.noteId;
const { title, content, tags, isPinned} = req.body;
const { user } = req.user;

if(!title && !content && !tags){
    return res
    .status(400)
    .json({error:true,message:"No Changes Provided"})
}

try {
    const note = await Note.findOne({_id:noteId, userId:user._id})

    if(!note){
        return res.status(404).json({ error:true, message:"Note Not Found"})
    }

    if(title) note.title = title;
    if(content) note.content = content;
    if(tags) note.tags = tags;
    if(isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
        error:false,
        note,
        message:"Note Successfully Upated",
    })


} catch (error) {
    
    return res.status(500).json({
        error:true,
        message:"Internal Server Error"
    })
}

})

//Get all notes
app.get("/get-all-notes", authenticateToken, async (req,res) =>{

    const {user} = req.user;

    try{
        const notes = await Note.find({ userId:user._id}).sort({ isPinned:-1});

        return res.json({
            error:false,
            notes,
            message: "All Notes retrieved successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"

        })
    }


})

//delete a note
app.delete("/delete-note/:noteId", authenticateToken, async (req,res) =>{
    const noteId = req.params.noteId;
    const { user } = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId:user._id});

        if(!note){
            return res.status(404).json({ error: true, message:"Note not Found"});
        }

        await Note.deleteOne({_id:noteId, userId:user._id});

        res.json({
            error:false,
            message:"Note Deleted Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",

    })
    }
})

//update isPinned Value
app.put("/update-note-pinned/:noteId",authenticateToken, async(req,res) =>{

const noteId = req.params.noteId;
const { isPinned} = req.body;
const { user } = req.user;



try {
    const note = await Note.findOne({_id:noteId, userId:user._id})

    if(!note){
        return res.status(404).json({ error:true, message:"Note Not Found"})
    }

 note.isPinned = isPinned;

    await note.save();

    return res.json({
        error:false,
        note,
        message:"Note Successfully Upated",
    })


} catch (error) {
    
    return res.status(500).json({
        error:true,
        message:"Internal Server Error"
    })
}
       
})


// Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { user } = req.user;
  
    if (!query) {
      return res.status(400).json({ error: true, message: "Query is required" });
    }
  
    try {
      const notes = await Note.find({
        userId: user._id,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } }
        ]
      }).sort({ isPinned: -1 });
  
      return res.json({
        error: false,
        notes,
        message: "Search results retrieved successfully"
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error"
      });
    }
  });
  

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;
