const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use('/', express.static('public'))

let room_id

var count = 0;
var user_to_edit
var dataToSend
var user_name
let user
let socket_id
var users_list = new Map([])
var users_deafened = new Map([])

function timeNow()
{
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return (`[${hours}:${minutes}:${seconds}]`);
}



io.on('connection', function(socket)
{

    socket.on('create-room', room =>
    {
        let answer = true
        if (users_list.has(room))
        {
            answer = false
        }
        console.log(timeNow() + ` Creating server with id: ${socket.id}`)
        io.to(socket.id).emit('create-room-answer', answer)
    })


    socket.on('join-room', room =>
    {

        if (users_list.has(room))
        {
            if (users_list.get(room).length == 3)
            {
                io.to(socket.id).emit('full-room')
                return
            }
        }

        let answer = false
        if (users_list.has(room))
        {
            answer = true
        }
        io.to(socket.id).emit('join-room-answer', answer)
    })
    socket.on('disconnect', function()
    {
        var disconnected_time = Date.now()
        io.sockets.emit("user-left", socket.id, disconnected_time);
    });

    socket.on('signal', (toId, message) =>
    {
        io.to(toId).emit('signal', socket.id, message);
    });
    socket.on('get-voice-activity', (toId) =>
    {
        io.to(socket.id).emit('set-voice-activity', users_deafened.get(toId))
    });


    socket.on('voiceInfos', (toId, obj) =>
    {
        users_deafened.set(toId, obj)
    });


    socket.on('join', function(name, room)
    {

        user_name = name
        room_id = room
        socket_id = socket.id

        resize_room(room_id, false)

        console.log(timeNow() + ` ${user_name} connected to room ${room_id}`)
        socket.join(room_id)

        var startTime = Date.now()

        io.to(room_id).emit("user-joined", startTime, socket.id, dataToSend)
        io.to(room_id).emit("participantsList")
    });






    socket.on('delete', function(id)
    {
        user_to_edit = id
        resize_room(room_id, true)

        io.sockets.emit("refactor", id, dataToSend)
    });

    socket.on('manually-disconnect', function()
    {
        var disconnected_time = Date.now()
        io.sockets.emit("user-left", socket.id, disconnected_time);
    });

    socket.on('destroy-room', function()
    {
        users_list = new Map([])
        console.log(timeNow() + 'room destroyed')
        socket = null;
    });



});


function resize_room(room_id, user_exits)
{

    if (user_exits)
    {
        console.log(timeNow() + ` room length = ${users_list.get(room_id).length}`)
        if (users_list.get(room_id).length > 0)
        {

            let count = 0
            users_list.get(room_id).forEach(function(map)
            {
                if (map.has(user_to_edit))
                {
                    users_list.get(room_id).splice(count, 1);
                    console.log(`user with id ${user_to_edit} deleted`)
                    return false
                }
                count++
            })
            console.log(users_list)
        }

        var temp = new Array();
        users_list.get(room_id).forEach(function(map)
        {
            temp.push(Array.from(map))
        })

        dataToSend = temp
        return
    }
    else
    {

        user = new Map()
        user.set(socket_id, user_name)

        if (users_list.has(room_id))
        {
            users_list.get(room_id).push(user)
        }
        else
        {
            var array = [user]
            users_list.set(room_id, array)
        }
        var temp = new Array();
        users_list.get(room_id).forEach(function(map)
        {
            temp.push(Array.from(map))
        })
        dataToSend = temp
        console.log(dataToSend)
    }
}


const port = process.env.PORT || 3000
server.listen(port, "localhost", () =>
{
    console.log(timeNow() + ` express signaling server is listening on port localhost:${port}`);
})
