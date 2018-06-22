function playVideo(stream,idVideo){
    var video=document.getElementById(idVideo)
    video.srcObject=stream
    video.onloadeddata=()=>{
        video.play()
    }
}
module.exports=playVideo