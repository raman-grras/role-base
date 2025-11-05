const express = require("express")
require('dotenv').config()
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5050
const connectDb = require('./db/connectDb')
const bodyParser = require("body-parser")
const path = require('path')
app.use(cors())

// body-parser
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, '../frontend/dist')))


// database connection
connectDb()


// // import route
const userRouter = require('./routes/userRoute')

app.use('/users', userRouter)


app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// server
app.listen(port, ()=>{
    console.log(`server started succesfully ${port}`)
})
