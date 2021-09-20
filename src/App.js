//-----------------------------------------------------
//Created by Paul Le Gall.
//Copyright (c) 2021 Paul Le Gall. All rights reserved.
//-----------------------------------------------------


import logo from './ecaps_logo.svg';
import './App.css';
import React, {useState, useEffect} from "react"
import Peer from 'peerjs';
import {host, path, stun1, turn1, turn2, turn3, turn4, turn5, turn6, username, credential} from "./config"
// use comforta font (download on google font service)
//turn6 is not used
//import simplepeer from "simple-peer"


function App() {

  const [streami, set_streami] = useState(true)
  const [id, set_id] = useState()
  const [input, set_input] = useState()
  const [peer_init, set_peer_init] = useState()
  const [message, set_message] = useState()
  const [connected_state, set_connected_state] = useState()
  const [input_msg, set_input_msg] = useState()
  //const [stream_kill_data, set_stream_kill_data] = useState()

  const input_event = e => {
    set_input(e.target.value)
  }

  const msg_input_event = e => {
    set_input_msg(e.target.value)
  }
//                          peerjs text msg (working in localhost...)
  const peer = () => {

   const peer = new Peer({
     host: host,
     path: path,
     secure: true,
     config: {
       "iceServers": [
         {
           "urls": [
             stun1
           ]
         },
         {
           username:  username,
           credential: credential,
           urls: [
            turn1,
           ]
         }
       ],
       "iceCandidatePoolSize": 2,
       "iceTransportPolicy": "relay"
     },
     debug: 3         //for dev only !
   })
    set_peer_init(peer)
    peer.on("open", (id) => {
      console.log(id)
      set_id(id)
    }) 

    //console.log(turn)
    //console.log(stun)
    
  }

  

 const send_msg = () => {
  const conn = peer_init.connect(input)
  conn.on("open", () => {
    conn.send(input_msg)
    console.log("msg sent !")
  })
 }

 const recive_msg = () => {
   peer_init.on("connection", (conn) => {
     conn.on("data", (data) => {
       console.log(data)
       set_message(data)
     })
   })
   window.alert("The peer is ready !")
 }
///////////////////////////////////////////////
/*
  const vid = () => {   //video and audio perm && replay on <video> by mediadevice element id
    if (navigator.platform !== "not supported platform id") {     //platform id check
      set_streami(true)
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          height: 720,
          width: 1280,
          facingMode: "user"
        }
      })
      .then((stream) => {

      /* use the stream  local feedback
      const video = document.getElementById("videobox")
      video.srcObject = stream
      })
      .catch(function(err) {
      /* handle the error 
      //window.alert(err)
      });
    }
    else {
      //set_streami(false)
    }
  }
  */
  const height = 250
  const width = 500

  const call_out  = () => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        height: height,
        width: width,
        facingMode: "user"
      }
    })
    .then((stream) => {
      //set_stream_kill_data(stream)
      const videolocal = document.getElementById("videoboxlocal")
      videolocal.srcObject = stream
      const call = peer_init.call(input, stream)
      call.on("stream", (remoteStream) => {
        const video = document.getElementById("videobox")
        video.srcObject = remoteStream
      })
    })
  }



  const call_answer = () => {
    peer_init.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          height: height,
          width: width,
          facingMode: "user"
        }
      })
      .then((stream) => {
        const videolocal  = document.getElementById("videoboxlocal")
        videolocal.srcObject = stream
        call.answer(stream)
        call.on("stream", (remoteStream) => {
          const video = document.getElementById("videobox")
          video.srcObject = remoteStream
        })
      })
    })
    window.alert("The peer is ready !")
  }

  const nav_check = () => {
    if (!streami) {
      return(
        <h1>Browser not compatible: {navigator.platform}</h1>
      )
    }
    else {
      return(
        <h1 className = "id">{navigator.platform}</h1>
      )
    }
  }


  const call_out_audio = () => {
    navigator.mediaDevices.getUserMedia({
      audio: true
    })
    .then((audiostream) => {
      //set_stream_kill_data(audiostream)
      const call = peer_init.call(input, audiostream)
      call.on("stream", (remoteStream) => {
        const audio = document.getElementById("audioremote")
        audio.srcObject = remoteStream
      })
    })
  }

  const call_answer_audio = () => {
    peer_init.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({
        audio: true
      })
      .then((audiostream) => {
        call.answer(audiostream)
        call.on("stream", (remoteStream) => {
          const audio = document.getElementById("audioremote")
          audio.srcObject = remoteStream
        })
      })
    })
    window.alert("The peer is ready !")
  }

  //testing mic and cam part

  const test_cam = () => {
    navigator.mediaDevices.getUserMedia({
      video: {
        height: height,
        width: width,
        facingMode: "user"
      }
    })
    .then((stream) => {
      //set_stream_kill_data(stream)
      const video = document.getElementById("videotestbox")
      video.srcObject = stream
      window.alert("Success !")
    })
    .catch((err) => {
      window.alert(err)
    })
  }

  const test_cam_mobile = () => {
    navigator.mediaDevices.getUserMedia({
      video: {
        height: height,
        width: width,
        facingMode: "environment"
      }
    })
    .then((stream) => {
      //set_stream_kill_data(stream)
      const video = document.getElementById("videotestbox")
      video.srcObject = stream
      window.alert("Success !")
    })
    .catch((err) => {
      window.alert(err)
    })
  }
  
  const test_mic = () => {
    navigator.mediaDevices.getUserMedia({
      audio: true
    })
    .then((audiostream) => {
      //set_stream_kill_data(audiostream)
      const audio = document.getElementById("audiotestbox")
      audio.srcObject = audiostream
      window.alert("Success !")
    })
    .catch((err) => {
      window.alert(err)
    })
  }

/*
  const kill_media = () => {
    stream_kill_data.getTracks().forEach(track => track.stop())
  }
*/
  useEffect(() => {
    //vid()
    peer()
  }, [])



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {nav_check()}
        <hr style = {{width:250}}></hr>
        <h5 className = "id">Remote Stream</h5>
        <video autoPlay = "true" id = "videobox" allow="camera;microphone" playsInline className = "video"></video>
        <h3 className = "id">My id : {id}</h3>
        <h3 className = "id">MSG: {message}</h3>
        <input placeholder = "other peer id" onChange = {input_event} value = {input} className = "idinput"></input>
        <input placeholder = "message to send" onChange = {msg_input_event} value = {input_msg} className = "idinput"></input>
        <button type = "button" onClick = {recive_msg}>recive</button>
        <button type = "button" onClick = {send_msg}>send</button>
        <hr style = {{width:250}}></hr>
        <h3 className = "id">Video call part (mix)</h3>
        <button type = "button" onClick = {call_out}>Call</button>
        <button type = "button" onClick = {call_answer}>Answer</button>
        <h5 className= "id">Local Stream</h5>
        <video autoPlay = "true" id = "videoboxlocal" allow = "camera;microphone" playsInline className = "video"></video>
        <hr style = {{width:250}}></hr>
        <h3 className = "id">Audio call part</h3>
        <button onClick = {call_out_audio}>Call (audio)</button>
        <button onClick = {call_answer_audio}>Answer (audio)</button>
        <audio autoPlay = "true" allow = "microphone" playsInline id = "audioremote"></audio>
        <hr style = {{width:250}}></hr>
        <h3 className = "id">Other Test</h3>
        <button onClick = {test_cam}>Camera Test</button>
        <button onClick = {test_cam_mobile}>Camera Test (Mobile only)</button>
        <button onClick = {test_mic}>Microphone Test</button>
        <button style = {{color:"red", marginTop:"5em"}}>Kill User_Media</button>
        <video autoPlay = "true" id = "videotestbox" allow = "camera" playsInline className = "video"></video>
        <audio autoPlay = "true" id = "audiotestbox" allow = "microphone" playsInline></audio>
        <hr style = {{width:250}}></hr>
        <h5 className = "id">Ecaps PeerJS pre-alpha V019</h5>
      </header>
    </div>
  );
}

export default App;
