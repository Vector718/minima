const offerGenerateButton = document.getElementById('generate-offer-sdp');
const offerSDP= document.getElementById('offer-sdp');
const answerGenerateButton = document.getElementById('generate-answer-sdp');
const answerSDP= document.getElementById('answer-sdp');
const setOfferButton= document.getElementById('set-offer-sdp');
const setAnswerButton= document.getElementById('set-answer-sdp');
const remoteOfferSDP= document.getElementById('remote-offer-sdp');
const remoteAnswerSDP= document.getElementById('remote-answer-sdp');
const offerBlock= document.getElementById('offer');
const answerBlock= document.getElementById('answer');
const createButton= document.getElementById('create-call')
const answerButton= document.getElementById('answer-call')
const servers= document.getElementById('servers')
const send= document.getElementById('send');
const chatBox= document.getElementById('chat-box');
const typeBox= document.getElementById('type-box');

//------------------------------------------------------------------------------------------//


let config={
    iceServers: [
        {
            urls: "stun:stun.relay.metered.ca:80",
        },
    ],
};

servers.value= JSON.stringify(config);



const peerConnection =new RTCPeerConnection(config);
const dc= peerConnection.createDataChannel('channel');

//------------------------------------------------------------------------------------------//

//Generate and set Offer

offerGenerateButton.addEventListener('click', async ()=>{
    const offer= await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);
    peerConnection.onicecandidate= ()=> {
        offerSDP.value= JSON.stringify(peerConnection.localDescription)
    };
    
    dc.onmessage= e =>{
        chatBox.value= chatBox.value +`\n B: ${e.data}` ;
        
    };
    dc.onopen= ()=>{
        activateChatArea();
    };
})

//Generate and set answer
answerGenerateButton.addEventListener('click', async ()=>{
    const answer= await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);
    peerConnection.onicecandidate= ()=> {
        answerSDP.value= JSON.stringify(peerConnection.localDescription)
    };
    
})

//Set offer sdp

setOfferButton.addEventListener('click',()=>{
    const offer= JSON.parse(remoteOfferSDP.value); 
    peerConnection.setRemoteDescription(offer);
    peerConnection.ondatachannel= e=>{
        peerConnection.dc= e.channel;
        peerConnection.dc.onmessage=event=>{
            chatBox.value= chatBox.value + `\n A: ${event.data}`;
        }
        peerConnection.dc.onopen=()=>{
            activateChatArea();
        };
    }

})
//Set answer sdp

setAnswerButton.addEventListener('click',()=>{
    const answer= JSON.parse(remoteAnswerSDP.value); 
    peerConnection.setRemoteDescription(answer)
})

//------------------------------------------------------------------------------------------//

offerBlock.style.display='none'
answerBlock.style.display='none'
document.getElementById('message').style.display= 'none';

createButton.addEventListener('click',()=>{
    offerBlock.style.display= 'flex';
    answerBlock.style.display= 'none';
})

answerButton.addEventListener('click',()=>{
    offerBlock.style.display= 'none';
    answerBlock.style.display= 'flex';
})


//------------------------------------------------------------------------------------------//


function activateChatArea(){
    document.getElementById('message').style.display= 'flex';
}


send.addEventListener('click',()=>{
    if (offerBlock.style.display=='none')
    {   chatBox.value+= `\n B: ${typeBox.value}`
        peerConnection.dc.send(typeBox.value);
    }
    else{
        chatBox.value+= `\n A: ${typeBox.value}`
        dc.send(typeBox.value);
    }
    typeBox.value= null;
})