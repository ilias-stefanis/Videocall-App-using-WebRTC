


function joinRoom(room, user1) {
    if (room === '' && user === '' ) {
      alert('Please type a room ID and a user ID')
    } else if (room === '') {
        alert('Please type a room ID')
    } else if (user === '') {
      alert('Please type a user ID')
    } else {
      roomId = room
      user = user1
      console.log(`room ${room}`)
      showVideoConference()
    }
  }

  async function showVideoConference() {
    chat_container.style.display = "flex";
    if (roomSelectionContainer){
    roomSelectionContainer[0].style.display = "none";
    }

    videoChatContainer[0].style.display = "block";
    chat[0].style.display = "block";
    asidenav[0].style.display = "flex";

    let hasMic = false
    let hasCam = false
    let check = ["audioinput" , "videoinput"]

   await navigator.mediaDevices.enumerateDevices()
    .then((devices) =>{
        devices.forEach((device) =>{
            if (device.kind == check[0]){
                hasMic = true
            }
            if (device.kind == check[1]){
                hasCam = true
            }
        })
    })

    var mediaConstraints = {
        video: hasCam,
        audio: hasMic,
    };

    console.log(mediaConstraints)

    await navigator.mediaDevices.getUserMedia( mediaConstraints )
        .then( function ( stream ) {

            localStream = stream;
            localVideoComponent.srcObject = stream
            localVideoComponent.play()
            socketId = socket.id;
            socket.emit('join', user , roomId)
            localStream.getTracks()[0].enabled  = false

            let det = {
                "id":socketId,
                "mic":true,
                "deaf":false
            }
            voiceInformations.set(socketId , det)
            socket.emit('voiceInfos' , socketId , voiceInformations.get(socketId))
            console.log(socketId, voiceInformations.get(socketId))
        })
        .catch(error =>{
            console.log(error)
        })


    $("#Username").html(user)
    $("#room-id").html(roomId)

    $('#aside-navigation').attr('style' , 'display:flex')
    $('#header-img').attr('style' , 'display:none')

  }


  window.onload = async function showVideoOnStart(){







        let hasMic = false
        let hasCam = false
        let check = ["audioinput" , "videoinput"]

       await navigator.mediaDevices.enumerateDevices()
        .then((devices) =>{
            devices.forEach((device) =>{
                if (device.kind == check[0]){
                    hasMic = true
                }
                if (device.kind == check[1]){
                    hasCam = true
                }
            })
        })

        var mediaConstraints = {
            video: hasCam,
            audio: hasMic,
        };

        console.log(mediaConstraints)

        await navigator.mediaDevices.getUserMedia( mediaConstraints )
            .then( function ( stream ) {

                localStream = stream;
                localVideoComponent.srcObject = stream
                localVideoComponent.play()
                socketId = socket.id;
                socket.emit('join', user , roomId)
                localStream.getTracks()[0].enabled  = false

                let det = {
                    "id":socketId,
                    "mic":true,
                    "deaf":false
                }
                voiceInformations.set(socketId , det)
                socket.emit('voiceInfos' , socketId , voiceInformations.get(socketId))
                console.log(socketId, voiceInformations.get(socketId))
            })
            .catch(error =>{
                console.log(error)
            })


        $("#Username").html(user)
        $("#room-id").html(roomId)

        $('#aside-navigation').attr('style' , 'display:flex')
        $('#header-img').attr('style' , 'display:none')


 }

  function update_overlay(id){

    var details = voiceInformations.get(id)
    console.log('update overlay',details)



    const imgMic = $('<img>')
    imgMic.attr('id' , `overlay-mic-${details.id}`)
    imgMic.attr('src' , '/assets/mic-closed.png')
    imgMic.attr('style' ,'padding-left : 5px;' )

    const imgDeaf = $('<img>')
    imgDeaf.attr('id' , `overlay-deaf-${details.id}`)
    imgDeaf.attr('src' , '/assets/deaf_deaf.png')
    imgDeaf.attr('style' ,'padding-left : 5px;' )

    if ($(`#overlay-mic-${details.id}`)){
        $(`#overlay-mic-${details.id}`).remove()
    }
    if ($(`#overlay-deaf-${details.id}`)){
        $(`#overlay-deaf-${details.id}`).remove()
    }

    if (details.mic && details.deaf){
        $($(`#${details.id}`).children()[0]).append(imgMic)
        $($(`#${details.id}`).children()[0]).append(imgDeaf)
    }
    else if (details.mic && !details.deaf){
        $($(`#${details.id}`).children()[0]).append(imgMic)
    }
    else if (!details.mic && details.deaf){
        $($(`#${details.id}`).children()[0]).append(imgDeaf)
     }

   }






function UpdateMediumMenuView(id , event , dlt){

    if (dlt){
        $(`#${id}`).remove()
        return
    }



    if (medium.children().length > 0){
        medium.attr('style' , 'visibility : visible')
        profile.attr('style' , 'border-top : 1px solid #383838')
        nav_background.attr('style' , 'border-top : 1px solid #383838')
    }

    eventList.set(id , event)

    const listitem = $('<li>')
    const video = document.createElement('video')
    const hover_div = $('<div>')
    const logo = $('<img>')

    const overlayDiv = $("<div>")
    const topText = $("<p>")

    logo.attr('src' ,'/assets/client.png')

    overlayDiv.attr('id' , 'overlayDiv_mediumnav')
    topText.attr('id' , 'topText_mediumnav')

    medium.append(listitem)

    listitem.attr('id' , id)
    hover_div.attr('class' , "hover-item")
    hover_div.attr('id' , id+"-hover")
    video.id = 'screens'
    video.className= 'screens'

    topText.html(users.get(id))
    overlayDiv.append(logo)
    overlayDiv.append(topText)
    listitem.append(overlayDiv)
    listitem.append(hover_div)
    listitem.append(video)

    topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px')

    video.onmouseenter  = function(){
        $(`#${id}-hover`).attr('style' , 'visibility = visible')
        overlayDiv.attr('style' , {
            left : '10%',
            bottom : '10%'
        })
        if (medium.children.length > 3){

            if (window.screen.width < 1480)
                topText.attr('style' , 'font-size : '+(6 - medium.children.length+10) + 'px')
            else
                topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px')
        }
        else
            topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px')


    }
    listitem.on('mouseleave',function(){
        document.getElementById(`${id}-hover`).style.visibility = 'hidden'
        overlayDiv.attr('style' , {
            left: '',
            bottom: '2%'
        })

        topText.html(`${users.get(id)}`)
        topText.attr('style' , 'font-size : '+(6 - medium.children.length+15) + 'px')
    })
    video.srcObject = event.stream;
    video.play();
    video.autoplay = true

}





function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg|JPG|JPEG|PNG)$/.test(url);
  }

  function getPics(event) {
        let filename = event.className
        let file
        let imgGraph

        const fullPage = $('#fullpage');
        fullPage.attr('style' , 'display: block')

        let tpics = Array.from( pics.keys() )

        for (let i = 0; i < tpics.length; i++){

            if (filename == tpics[i].name){
                console.log(tpics[i].name)
                file = tpics[i]
                break;
            }
        }
        if ($("#center-view").children().length > 0){
            imgGraph = $($("#center-view").children[0])
            imgGraph.attr('src' , URL.createObjectURL(file))
            $("#center-view").append(imgGraph)
        }
        else{
            imgGraph = $('<img>')
            imgGraph.attr('src' , URL.createObjectURL(file))
            $("#center-view").append(imgGraph)
        }

        $($("#center-view").children()[0]).attr('class' , filename)

        let list = $("#bottomList")

        for (let i = 0; i < tpics.length; i++){
            console.log(`pic ${tpics[i]}`)
            console.log(`file ${file}`)
            if (filename != tpics[i].name){
                let li = $('<li>')
                let bot_img = $('<img>')
                bot_img.attr('src' , URL.createObjectURL(tpics[i]))

                list.append(li)
                li.append(bot_img)
                bot_img.attr('id' , tpics[i].name)

                li.on('click' , function(){
                    changePhotoView(bot_img.attr('id'))
                })
            }
        }
        let link = $("#link")
        let cc = $("#center-view")
        link.attr('href' , picsNames.get(filename))
        link.attr('download' ,`${$(cc.children()[0]).attr('class')}`)
}




function calculateDelay(startTime){
    var latency =  Date.now() - startTime;
    document.getElementById("latency").innerHTML = `${latency} ms`
}



function changePhotoView(id){

    const center = $("#center-view")
    const bottom = $("#bottomList")
    const center_image_elem = center.children()[0]
    console.log('center' , center_image_elem.className)

    const center_img_blob = picsNames.get(center_image_elem.className)
    const bottom_img_blob = picsNames.get(id)




    $(center.children()[0]).remove()


    for (let i = 0; i< bottom.children().length; i++){
        if ($(bottom.children()[i]).children()[0].id === id){
            $(bottom.children()[i]).remove()
            break;
        }
    }




    const c_img = $('<img>')
    const link = $('#link')
    c_img.attr('class' , id)
    c_img.attr('src' , bottom_img_blob)

    center.append(c_img)
    link.attr('href' , picsNames.get(c_img.attr('class')))
    link.attr('download' ,`${c_img.attr('class')}` )


    const b_img = $('<img>')
    const li = $('<li>')
    b_img.attr('id' ,center_image_elem.className)
    b_img.attr('src' ,center_img_blob)
    li.append(b_img)
    bottom.append(li)

    li.on('click' , function(){
        changePhotoView(b_img.attr('id'))
    })
}

function storeImg(file , url){
    pics.set(new File([file] , filename), url)
    picsNames.set(filename, url)

}






const roomSelectionContainer = $('#room-selection-container');
const roomInput = $('#room-input');
const userInput = $('#user-id');
const connectButton = $('#connect-button');
const messageInput = $('#message-input');
const create_room = $('#create-room');
const join_room = $('#join-room');
const box = $('#box');

const userListInput = $('#usersList');
const participantsList = $('#participants');
const chat = $('#chat');
const chat_container = document.getElementById("messaging-container");
const sendButton = $('#send-button');
const muteButton = $("#mic");
const deafButton = $("#deaf");
const exitButton = $("#exit");
const videomedium = $("#video-medium");
const InitParticipantsArea = $("#users-logo");
const InitChatArea = $("#chat-logo");
const hover = document.querySelector("#screens");

const asidenav = $('#navigation');
const medium = $("#medium-view");
const video_div = document.getElementById('remote-video-container');
const profile = $('#profile');
const nav_background = $('#nav-and-menu');
const video_div_bottom = document.getElementById('remote-video-container2');


const videoChatContainer = $('#video-chat-container');
const localVideoComponent = document.getElementById('local-video');
const remoteVideoComponent = $('#remote-video');

const MAXIMUM_CHUNKFILE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';
const senders = [];
const pics = new Map([]);
const picsNames = new Map([]);

let ImgSent = false;
let Imgfile = "";

const socket = io();


var localVideo;
var isRoomCreator = false;
var socketCount = 0;
var socket_id;
let localStream;
var connections = [];
let roomId;
let user;
var users;
let eventList = new Map([]);

let children_len;
let screen_stream;
let hasFullScreen = false;
let {width, height} = {};
var rooms = [];
var dataChannel;
var receiveChannel;
let receivedBuffers = [];
var filename;
var voiceInformations = new Map([]);
let isBlob = false;


var latency;





socket.on('full-room' , () => {
      alert('Room is full')
   })

 socket.on('create-room-answer' , answer => {
     if (answer)
        joinRoom(roomInput.val(), userInput.val())
     else
        alert(`Room with id #${roomInput.val()} already exists.`)
 })

 socket.on('join-room-answer' , answer => {
    if (answer)
       joinRoom(roomInput.val(), userInput.val())
    else
       alert(`Room with id #${roomInput.val()} does not exists.`)
})


 socket.on('signal', gotMessageFromServer)

 socket.on('broadcast-message', function(id , message , startTime){
     calculateDelay(startTime)
     initRemoteMessage(id , message)
 })

 socket.on('participantsList', showParticipants)

 socket.on('user-left', function(id , startTime){

    calculateDelay(startTime)
    if (users){
        if (users.has(id)){

            console.log(`user ${users.get(id)} deleted`)
            users.delete(id)
            voiceInformations.delete(id)

            rooms[id].close()
            for (i in voiceInformations.keys()){
                console.log(voiceInformations.get(i))
            }


            socket.emit('delete' , id)


            showParticipants()
        }
    }
 });

 socket.on("refactor" , function(id , usersArray) {

    if (hasFullScreen){
        selectedid = id
        UpdateMediumMenuView(id , eventList.get(id) , true)
        socket.emit('get-voice-activity' , id)
        $(`#${id}`).remove()
    }
    users = new Map([])

    for (var i = 0; i < usersArray.length; i++){
        var us = new Map(JSON.parse(JSON.stringify(usersArray[i])));
        const [key] = us.keys()
        const [value] = us.values()
        users.set(key , value)
    }

    console.log("refactor",users)
    let usersIds = Array.from( users.keys() );

    while (video_div.children[0]) {
        video_div.removeChild(video_div.children[0]);
    }

    while (video_div_bottom.children[0]) {
        video_div_bottom.removeChild(video_div_bottom.children[0]);
    }

    console.log(medium.children().length)

    usersIds = Array.from( users.keys() );
    for (var i = 0; i < usersIds.length; i++){
        if (eventList.has(usersIds[i]) && usersIds[i] != socket_id ){

            if (hasFullScreen){
                var count=0
                for (var j=0; j<medium.children().length; j++){
                    if ($(medium.children()[j]).attr('id') != usersIds[i]){
                        console.log("reinit stream",$(medium.children()[j]).attr('id'))
                        count++
                    }
                }
                if (count == medium.children().length){
                    setRemoteStream(eventList.get(usersIds[i]) , usersIds[i])
                    socket.emit('get-voice-activity' , usersIds[i])
                }

            }
            else{
                setRemoteStream(eventList.get(usersIds[i]) , usersIds[i])
                console.log('trigerred' , usersIds[i])
                socket.emit('get-voice-activity' , usersIds[i])
            }

        }
    }


    if (video_div.children.length == 0 && medium.children().length > 0){
        console.log('rework' , $(medium.children()[0]).attr('id'))
        setRemoteStream(eventList.get($(medium.children()[0]).attr('id')) ,$(medium.children()[0]).attr('id'))
        socket.emit('get-voice-activity' , $(medium.children()[0]).attr('id'))
        $(medium.children()[0]).remove()
    }


    if (medium.children().length == 0){

        medium.attr('style' , 'visibility:hidden');
        medium.attr('style' , 'visibility:hidden');
        nav_background.attr('style' , 'border-top:none');
        hasFullScreen = false

        $($("#fullscreen").children()[0]).attr('src' , '/assets/fullscreen.png');
        $($("#fullscreen").children()[0]).attr('title' , 'Normalscreen Enabled');
    }

 })

 socket.on('set-voice-activity' , dtls =>{
     if (dtls !== null ){
        console.log(dtls)
        voiceInformations.set(dtls.id , dtls)
        for (i of voiceInformations.keys()){
            console.log(i , voiceInformations.get(i))
        }
        update_overlay(dtls.id)
     }

 })

 socket.on('user-joined' , function(startTime, id, usersArray){

    calculateDelay(startTime)

    users = new Map([])
    for (i = 0; i < usersArray.length; i++){
        var us = new Map(JSON.parse(JSON.stringify(usersArray[i])));
        const [key] = us.keys()
        const [value] = us.values()
        users.set(key , value)
    }
    console.log(users)
    let clients = Array.from( users.keys() );

    clients.forEach(function(socketListId) {
         if(!connections[socketListId]){
             connections[socketListId] = new RTCPeerConnection();

                if (socketListId != socket_id){
                    dataChannel = connections[socketListId].createDataChannel(`datachannel`,{negotiated: true, id: 0})

                    rooms[socketListId] = dataChannel

                    dataChannel.addEventListener('open', () => {
                        console.log('datachannel created' +" " + dataChannel.readyState +" sid" +socketListId)
                    });


                    dataChannel.addEventListener('message',async (event) =>{

                        dataChannel.binaryType = 'arraybuffer';
                            const { data } = event;
                            try {
                                console.log("typeof data", typeof data)

                                if (data instanceof Blob){
                                    isBlob = true
                                }

                                if (typeof data  !== 'string') {
                                    receivedBuffers.push(data);
                                    console.log(data)
                                }
                                else if (typeof data  == 'string' && receivedBuffers.length == 0 && data.slice(0,11) === '~Mic-~Deaf~'){
                                    let str = data.slice(11, data.length);
                                    voiceInformations.set(id , JSON.parse(str))
                                    update_overlay(id)
                                    return
                                }

                                else if(typeof data  == 'string' && receivedBuffers.length == 0){
                                    initRemoteMessage(socketListId , data)
                                    console.log(data)
                                    return
                                }
                                else {
                                    const arrayBuffer = receivedBuffers.reduce((acc, arrayBuffer) => {
                                        const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
                                        tmp.set(new Uint8Array(acc), 0);
                                        tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
                                        return tmp;
                                    }, new Uint8Array());
                                    const blob = new Blob([arrayBuffer]);
                                    filename = data
                                    receivedBuffers = []
                                    displayFileMessage(blob , socketListId)
                                }
                            } catch (err) {
                                console.log('Message transfer failed');
                            }
                        });
                }


             connections[socketListId].onicecandidate = function(event){
                if(event.candidate != null) {
                    console.log('---sending ice candidate---');

                    socket.emit('signal', socketListId, JSON.stringify({'ice': event.candidate}));
                }
            }


            if (hasFullScreen){
                console.log('fullscrenn adder' , socketListId)
                connections[socketListId].onaddstream = function(event){
                    UpdateMediumMenuView(socketListId , event , false)
                    socket.emit('get-voice-activity' , id)
                }
            }
            else{
                connections[socketListId].onaddstream = function(event){
                    setRemoteStream(event, socketListId)
                    socket.emit('get-voice-activity' ,socketListId)
                }
            }


           localStream.getTracks().forEach(track =>
                senders.push(connections[socketListId].addTrack(track, localStream) )
            );
        }
     });
     if(users.size >= 2){
         connections[id].createOffer().then(function(description){
             connections[id].setLocalDescription(description).then(function() {
                 console.log(`new user !  id: ${id}`)
                 console.log(connections[id].localDescription)
                 socket.emit('signal', id, JSON.stringify({'sdp': connections[id].localDescription}));
             }).catch(e => console.log(e));
         });
     }
 })

function gotMessageFromServer(sender_id, message){

    var JSON_of_signal = JSON.parse(message);

    if(sender_id != socket_id){
        if(JSON_of_signal.sdp){
            connections[sender_id].setRemoteDescription(new RTCSessionDescription(JSON_of_signal.sdp)).then(function() {
                if(JSON_of_signal.sdp.type == 'offer') {

                    connections[sender_id].createAnswer().then(function(description){
                        connections[sender_id].setLocalDescription(description).then(function() {
                            socket.emit('signal', sender_id, JSON.stringify({'sdp': connections[sender_id].localDescription}));
                        }).catch(e => console.log(e));
                    }).catch(e => console.log(e));
                }
            }).catch(e => console.log(e));
        }
        if(JSON_of_signal.ice) {
            console.log(JSON_of_signal.ice);
            connections[sender_id].addIceCandidate(new RTCIceCandidate(JSON_of_signal.ice)).catch(e => console.log(e));
        }
    }
}

function setRemoteStream(event, id) {

    let children
    let children_bottom

    let arr
    console.log(id)
    eventList.set(id , event)

    const new_div = document.createElement('div');
    const new_video = document.createElement("video");
    const overlayDiv = document.createElement("div");
    const topText = document.createElement("p");
    const logo = document.createElement("img");

    overlayDiv.id = 'overlayDiv'
    topText.id = 'topText'
    logo.src ='/assets/client.png'

    topText.innerHTML = users.get(id)
    overlayDiv.appendChild(logo)
    overlayDiv.appendChild(topText)

    new_div.appendChild(overlayDiv)

    new_div.className = users.get(id)

    new_div.id = id
    new_div.position = 'relative'
    new_video.style.position = "relative"
    new_video.style.zIndex = "0"
    new_video.className= "video"

    new_video.srcObject = event.stream;
    new_video.play();
    new_video.autoplay = true

    if (video_div.children.length + video_div_bottom.children.length  < 3){
        video_div.appendChild(new_div)
        new_div.appendChild(new_video)
        children = video_div.children
        arr = Array.from(children)
        children_len = children.length
    }
    else{
        children = video_div.children
        children_len = children.length
        video_div_bottom.appendChild(new_div)
        new_div.appendChild(new_video)

        children_bottom = video_div_bottom.children
        children_len += children_bottom.length
    }

    console.log('children ' , children_len )

    if (children_len  >= 4){
        video_div.style.height = "35%"
        video_div_bottom.style.height = "35%"
        video_div_bottom.style.display = 'flex'
        video_div_bottom.style.margin = 'auto'
        video_div_bottom.style.alignItems = 'center'

        for (i of children){

            i.style.width = 100 / 4 +'%';
            console.log('calculated width ' , i.style.width )
            i.style.height = 'max-content';
            i.style.margin = 'auto'
            i.style.border = '6px solid var(--main)'
        }
        for (i of children_bottom){

            i.style.width = 100 / (4) +'%';
            console.log('calculated width' , i.style.width)
            i.style.height = 'max-content';
            i.style.margin = 'auto'
            i.style.border = '6px solid var(--main)'
        }
    }
    else if (children_len<4){

        if (children_len == 1){
            video_div_bottom.style.height = "0%"
            video_div.style.height = "70%"

            new_div.style.width = 'max-content'
            new_div.style.height = '97%'
            new_div.style.margin = 'auto'
            new_div.style.marginTop = '10px'
            new_div.style.border = '6px solid var(--main)'

            new_video.style.height = '100%'
        }
        else{
            arr.forEach((item) =>{
                item.style.width = 100 / children_len +'%';
                console.log('calculated width ' , item.style.width )
                item.style.height = 'max-content';
                item.style.margin = 'auto'
                item.style.border = '6px solid var(--main)'
            })
        }
    }

    new_video.style.height = '100%'
    new_video.style.width = '100%'
}


function showParticipants() {

    participantsList.html('');

    const usernames = Array.from(users.values())
    usernames.forEach(function(name){
        participantsList.html(participantsList.html()+`<li> ${name} </li> `)
    })
}

function displayMessage(message) {
    message += "<br>"
    $("#chat-area").html($("#chat-area").html() + '<div class=chatroom-user>' + '<p>'+ message + '</p></div>');
    $("#message-input").val('');

    for (id in rooms){
        if (id != socket_id && rooms[id].readyState =='open')
            rooms[id].send(message);
    }

    $("#chat-area").scrollTop($("#chat-area").prop('scrollHeight'));
}

function initRemoteMessage(id ,message){
    if (id != socket_id)
        $("#chat-area").html($("#chat-area").html() +'<div class=chatroom-remote>'+ '<h3>'+users.get(id)+'</h3>'+'<p>'+ message+'</p></div>')

    $("#chat-area").scrollTop($("#chat-area").prop('scrollHeight'));
}









   create_room.on('click', () => {
    connectButton.html('CREATE')
    box.attr('style' , 'visibility : visible')
    roomSelectionContainer.attr('style' , 'marginTop : 5%')
    changeItem(create_room , join_room)
  })


  join_room.on('click', () => {
    connectButton.html('JOIN')
    box.attr('style' , 'visibility : visible')
    roomSelectionContainer.attr('style' , 'marginTop : 5%')
    changeItem(join_room, create_room)
  })

  function changeItem(new_item , old_item){


    new_item.attr('style' ,'color : #0f01cff3')

    old_item.attr('style' ,'color : #09008a')
}

  connectButton.on('click', () => {

    if (connectButton.html() == 'CREATE'){
        socket.emit('create-room' , roomInput.val())
    }
    else if (connectButton.html() == 'JOIN'){
        socket.emit('join-room' , roomInput.val())
    }

  })


  sendButton.on('click', (e) => {
    e.preventDefault()

    const message = messageInput.val()

    if (message==="") return
    displayMessage(message)
  })


  muteButton.on('click', () => {
    if ($(muteButton.children()[0]).attr('src') == `/assets/mic-opened.png`){
        localStream.getTracks()[0].enabled  = false
        $(muteButton.children()[0]).attr('src' , '/assets/mic-closed.png')


        let details ={
            "id":socketId,
            "mic":true,
            "deaf":false
        }
        voiceInformations.set(socketId,details)
        for (id in rooms){
            if (id != socketId && rooms[id].readyState =='open')
                rooms[id].send("~Mic-~Deaf~"+JSON.stringify(details));
        }
    }
    else{
        localStream.getTracks()[0].enabled  = true
        $(muteButton.children()[0]).attr('src' , '/assets/mic-opened.png')
        $('video').prop('volume', '1.0');
        $(deafButton.children()[0]).attr('src' , '/assets/deaf.png')


        let details ={
            "id":socketId,
            "mic":false,
            "deaf":false
        }
        voiceInformations.set(socketId,details)
        for (id in rooms){
            if (id != socketId && rooms[id].readyState =='open')
                rooms[id].send("~Mic-~Deaf~"+JSON.stringify(details));
        }

    }
    $(muteButton.children()[0]).attr('style' ,'width : 18px; height: 22px;' )
    socket.emit('voiceInfos' , socketId , voiceInformations.get(socketId))
  })


    deafButton.on('click', () => {

        if ($(deafButton.children()[0]).attr('src') == `/assets/deaf.png`){

            $(deafButton.children()[0]).attr('src' , '/assets/deaf_deaf.png')
            $(muteButton.children()[0]).attr('src' , '/assets/mic-closed.png')

            $('video').prop('volume', '0.0');
            localStream.getTracks()[0].enabled  = false

            let details ={
                "id":socketId,
                "mic":true,
                "deaf":true
            }
            voiceInformations.set(socketId,details)
            for (id in rooms){
                if (id != socketId && rooms[id].readyState =='open')
                    rooms[id].send("~Mic-~Deaf~"+JSON.stringify(details));
            }
        }
        else{
            $('video').prop('volume', '1.0');
            $(deafButton.children()[0]).attr('src' , '/assets/deaf.png')


            let details = {
                "id":socketId,
                "mic":true,
                "deaf":false
            }
            voiceInformations.set(socketId,details)
            for (id in rooms){
                if (id != socketId && rooms[id].readyState =='open')
                    rooms[id].send("~Mic-~Deaf~"+JSON.stringify(details));
            }
        }
        $(deafButton.children()[0]).attr('style' ,'width : 20px; height: 22px;' )
        socket.emit('voiceInfos' , socketId , voiceInformations.get(socketId))
      })


   $('#camera').on('click', () => {
       let str = $($('#camera').children()[0]).attr('src')
        if (str == '/assets/camera.png'){
            $($('#camera').children()[0]).attr('src' , '/assets/no_camera.png')
            localStream.getVideoTracks()[0].enabled  = false
            $($('#camera').children()[0]).attr('title' ,'Enable camera')
        }
        if (str == '/assets/no_camera.png'){
            localStream.getVideoTracks()[0].enabled  = true
            $($('#camera').children()[0]).attr('src' , '/assets/camera.png')
            $($('#camera').children()[0]).attr('title' ,'Disable camera')
        }
    })


  exitButton.on('click', () => {

      if (users.size == 1){
        socket.emit("destroy-room")
      }
      else{
        socket.emit("manually-disconnect")
      }
      location.reload();
  })






InitParticipantsArea.on('click', () => {

    if (userListInput.css('display') === 'none'){
        chat.attr('style' ,'display : none')
        userListInput.attr('style','display:block')
        $(InitChatArea.children()[0]).attr('src' , '/assets/chat-white.png')
        $(InitParticipantsArea.children()[0]).attr('src' , '/assets/users.png')
    }
})


InitChatArea.on('click', () => {

    if (chat.css('display') === 'none'){
        userListInput.attr('style','display:none')
        chat.attr('style','display=block')
        $(InitChatArea.children()[0]).attr('src' , '/assets/chat.png')
        $(InitParticipantsArea.children()[0]).attr('src' , '/assets/users-white.png')
    }

})
