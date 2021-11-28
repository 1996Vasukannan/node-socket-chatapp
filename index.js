const express = require('express')
const socketio =require('socket.io')
const http =require('http')
const path=require('path')
const generateMessage=require('./utils/message')
const {addUser,getUser,removeUser,getUserInRoom}=require('./utils/users')

const app=express()
const port =process.env.PORT || 3000
const server=http.createServer(app)
const publicDirectoryPath=path.join(__dirname,'./public')

app.use(express.static(publicDirectoryPath))

const io =socketio(server)

io.on('connection',(socket)=>{

    socket.on('join', ({ username, room },callback) => {
        const {error,user}=addUser({id:socket.id, username,room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)

        console.log(user.room)
        socket.emit('sendUserMessage', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('userJoiningEvent', generateMessage( user.username,`has joined!`))
        io.to(room).emit('roomData',{room:room,users:getUserInRoom(room)})

    })

    socket.on('sendMessage',(message,callback)=>{
        const user=getUser({id:socket.id})
        socket.broadcast.to(user.room).emit('sendUserMessage',generateMessage(user.username,message))
        socket.emit('ownMessage',generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user=getUser({id:socket.id})
        socket.broadcast.to(user.room).emit('sendLocationMessage',generateMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        socket.emit('ownLocationMessage',generateMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        const user=removeUser({id:socket.id})
        if(user){
        io.to(user.room).emit('userJoiningEvent',generateMessage(user.username ,` has left`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        }
    })
})





server.listen(port,()=>{
    console.log(`Server is up on port:${port}`)
})

