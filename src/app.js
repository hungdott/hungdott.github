var https = require("https");
const Peer = require('peerjs')
const uid = require('uid')
const $=require('jquery')
const io =require('socket.io-client')

const socket= io('https://stream-byhungbn.herokuapp.com/')

const openStream=require('./openCamera')
const playVideo=require('./playVideo')

// Node Get ICE STUN and TURN list
var options = {
    host: "global.xirsys.net",
    path: "/_turn/hungdo99ttbn",
    method: "PUT",
    headers: {
        "Authorization": "Basic " + new Buffer("hungdo:06081f0c-7558-11e8-a620-264837236acc").toString("base64")
    }
};
var httpreq = https.request(options, function(httpres) {
    var str = "";
    httpres.on("data", function(data){ str += data; });
    httpres.on("error", function(e){ console.log("error: ",e); });
    httpres.on("end", function(){ 
        console.log("ICE List: ", str);
    });
});
httpreq.end();

const connection={
    host:'streambase.herokuapp.com', 
    port: 443, 
    secure: true, 
    key: 'peerjs',
    config: options
 }
 $('#Form-Call').hide()
 //socket

function getPeer(){
    const id=uid(10);
    $('#peer1-id').append(id);
    $('#btnSignUp').click(()=>{
        const username=$('#txtUserName').val()
        socket.emit('NGUOI_DUNG_DK',{ten:username,peerId: id}) 
        $('#myUsr').append(username)
    })
    return id;
 }

 const peerId=getPeer()
 socket.emit('NEW_PEER_ID',peerId)

 socket.on('DK_That_bai',()=>{
    alert('moi nhap user khac')
    $('#txtUserName').val("")
})


 socket.on('Danh_Sach_Online',arrUserInfor=>{
    $('#Form-Call').show()
    $("#logIn-Form").hide()
     arrUserInfor.forEach(user => {
         const {ten,peerId}=user
         $("#ulPeerId").append(`<li id="${peerId}">${ten}</li>`)
     });
     socket.on('Co_Nguoi_Moi',user=>{
        const {ten,peerId}=user
        $("#ulPeerId").append(`<li id="${peerId} ">${ten}</li>`)
    })

})
socket.on('SOMEONE_DISCONNECT',peerId=>{
    
    $(`#${peerId}`).remove()
})
// socket.on('NEW_PEER_CONNECT',user => {
//     const {ten,peerId}=user
//     $("#ulPeerId").append(`<li id="${peerId}">${ten}</li>`)
// });


  


$("#ulPeerId").on('click','li',function(){
    const id=$(this).attr('id')
    console.log(id);
    openStream(stream=>{
        playVideo(stream,'localStream')
        const call=peer.call(id,stream)
        call.on('stream',remoteStream => playVideo(remoteStream,'friendStream'))
    })
})

 const peer = new Peer(peerId,connection)
 console.log(peer);
 


    
peer.on('call',call=>{    
    openStream(stream=>{
        playVideo(stream,'localStream')
        call.answer(stream)
        call.on('stream',remoteStream => playVideo(remoteStream,'friendStream'))
})
})


