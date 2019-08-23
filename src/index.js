const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is running on port " + port);
});

// const multer = require('multer')

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('upload word document'))
//         }

//         cb(undefined, true)
//         // cb(new Error('file must be PDF'))
//         // cb(undefined, true)

//     }
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('from Middleware')
// }

// app.post('/upload', upload.single('upload'), (req,res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5d441a2c2663a44d40706cdd')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)

//     const user = await User.findById('5d441a242663a44d40706cdb')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

// const pet = {
//     name: 'krapstukas'
// }

// pet.toJSON = function() {
//     console.log(this)
//     return this
// }

// console.log(JSON.stringify(pet))
