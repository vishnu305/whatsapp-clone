import styled from 'styled-components';
import {Avatar,IconButton,Button} from "@material-ui/core";
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import {auth,db} from "../firebase";
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import Chat from './Chat';

function Sidebar(){
  const [user] = useAuthState(auth);
  const userChatRef = db.collection('chats').where('users','array-contains',user.email);
  const [chatsSnapshot]=useCollection(userChatRef);
  const createchat = ()=>{
    const input=prompt('Please enter an email address for the user you wish to chat with');
    if(!input) return null;
    if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email){
      //we need to add the chat into the DB 'chats' collection
      db.collection('chats').add({
        users: [user.email,input],
      })
    }
  }
  const chatAlreadyExists = (recipientEmail)=>
      !!chatsSnapshot?.docs.find((chat) => chat.data().users.find(user=>user === recipientEmail)?.length > 0
    );

  return(<Container>
    <Header>
      <UserAvatar src={user.photoURL} onClick={()=>auth.signOut()} />
      <IconsContainer>
        <IconButton>
        <ChatIcon/>
        </IconButton>
        <IconButton>
        <MoreVertIcon/>
        </IconButton>
      </IconsContainer>
    </Header>
    <Search>
      <SearchIcon />
      <SearchInput placeholder="Search or start new chat"/>
    </Search>
    <SidebarButton onClick={createchat}>Start a new chat</SidebarButton>
    {chatsSnapshot?.docs.map((chat)=>(
        <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
    ))}

    </Container>)
}
export default Sidebar;
const SidebarButton =styled(Button)`
    width:100%;
    &&&{
      border-top: 1px solid lightgray;
      border-bottom: 1px solid lightgray;
    }

`
const Container =styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width:300px;
  max-width:350px;
  overflow-y: scroll;
  ::-webkit-scrollbar{
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

`;
const Header=styled.div`
    display: flex;
    align-items: center;
    position: sticky;
    top:0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid lightgray;
    border-right: 1px solid lightgray;

`;
const UserAvatar = styled(Avatar)`
  margin: 10px;
  cursor: pointer;
  :hover{
    opacity: 0.8;
  }
`
const IconsContainer=styled.div`

`
const Search=styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 15px;
    background-color: lightgray;
    margin-top: 5px;
    margin-bottom: 5px;


`
const SearchInput=styled.input`
    outline-width:0;
    background-color:lightgray;
    border: none;
    flex:1;
`
