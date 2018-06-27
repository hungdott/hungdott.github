var https = require("https");
const Peer = require('peerjs')
const uid = require('uid')
const $=require('jquery')
//const Ice=require('ice')
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
function getPeer(){
    const id=uid(10);
    $('#peer1-id').append(id);
     return id;
 }
 const peer = Peer(getPeer(),connection)
 console.log(peer);
 

$('#btnCall').click(()=>{
    const friendId = $('#txtFriendId').val()
    openStream(stream=>{
        playVideo(stream,'localStream')
        const call=peer.call(friendId,stream)
        call.on('stream',remoteStream => playVideo(remoteStream,'friendStream'))
    })
})
    
peer.on('call',call=>{    
    openStream(stream=>{
        playVideo(stream,'localStream')
        call.answer(stream)
        call.on('stream',remoteStream => playVideo(remoteStream,'friendStream'))
})
})


