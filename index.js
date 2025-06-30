require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const {userRouter} = require("./Routes/user");

app.use(express.json());


app.use("/api/v1/user/" , userRouter);
app.use("/api/v1/portfolio/" , portfolioRouter);


async function main() {
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected")
    app.listen(3000 , ( ) => {
        console.log("Server is running on : https://localhost:3000");
    })
}
catch(e){
    console.log("Failed to connect to database.\nTry again....!")
    console.log(e);
}
}

main();