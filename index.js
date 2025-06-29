require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const {userRouter} = require("./Routes/user");
const cors = require("cors");

app.use(cors({
    origin : "http://localhost:3000",
    credentials : true,
}))

// app.use(cors());

app.use(express.json());


app.use("/api/v1/user/" , userRouter);


async function main() {
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected")
    app.listen(8000 , ( ) => {
        console.log("Server is running on : http://localhost:8000");
    })
}
catch(e){
    console.log("Failed to connect to database.\nTry again....!")
    console.log(e);
}
}

main();