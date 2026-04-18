const express = require('express')
const cors = require('cors')
const app = express()
const todosRouter = require('./routes/todos')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use('/todos', todosRouter)

app.get('/', (req, res) => {
    res.send('Hello World')
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.listen(3000, () => console.log('Server running on port 3000'))