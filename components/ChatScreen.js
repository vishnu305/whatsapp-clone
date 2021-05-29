import styled from 'styled-components';
import {auth,db} from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useRouter} from 'next/router';
import {Avatar,IconButton} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {useCollection} from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Message from './Message';
import {useRef,useState} from 'react';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
function ChatScreen({chat,messages}){
  const [user]=useAuthState(auth);
  const [input,setInput]=useState('');
  const endOfMessageRef = useRef(null);
  const router = useRouter();
  const [messagesSnapshot]=useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'));
  const ScrollToBottom = ()=>{
    endOfMessageRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    })
  }
  const sendMessage = (e)=>{
    e.preventDefault();
    db.collection("users").doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),

    },{merge: true})
    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })
    setInput('');
    ScrollToBottom();
  }
  const [recipientSnapshot]= useCollection(
    db.collection('users').where('email','==',getRecipientEmail(chat.users,user))
  )
  const showMessages = ()=>{
    if (messagesSnapshot){
      return messagesSnapshot.docs.map((message) =>{
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}

        />
      })
    }else{
      return JSON.parse(messages).map(message => (
        <Message key={message.id} user={message.user} message={message}/>
      ))
    }
  }
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail=getRecipientEmail(chat.users,user);
  return(<Container>
        <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL}/>
        ):(<Avatar>{recipientEmail[0]}</Avatar>)}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot? (
            <p>Last active: {''}
            {recipient?.lastSeen?.toDate()?(
              <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
            ):"Unavailable"}
            </p>
          ):(
            <p>Loading Last active ...</p>
          )}

        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
        </Header>
        <MessageContainer>
          {showMessages()}
          <EndOfMessage ref={endOfMessageRef}/>
        </MessageContainer>
        <InputContainer>
          <InsertEmoticonIcon/>
          <Input value={input} onChange={ e => setInput(e.target.value)} />
          <button hidden disable={!input} type="submit" onClick={sendMessage}>Send Message</button>
          <MicIcon/>
        </InputContainer>
    </Container>)
}
export default ChatScreen;
const InputContainer= styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom:0;
  background-color:white;
  background-color:#DCF8C6;
  z-index:100;
`
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`
const Container = styled.div``
const Header = styled.div`
    position: sticky;
    background-color:#DCF8C6;
    z-index:100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid lightgray;
`
const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3{
      margin-bottom: 3px;
    }
    > p{
      font-size: 14px;
      color: gray;
    }
`
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
  `;
const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;