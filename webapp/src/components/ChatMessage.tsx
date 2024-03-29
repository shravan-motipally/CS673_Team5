import * as React from 'react';
import { ChatMessageType } from './types/Chat.types';
import {useTheme} from "@mui/material/styles";
import {useMediaQuery} from "@mui/material";
import {useContext} from "react";
import {ScreenContext} from "../App";

const ChatMessage: React.FC<ChatMessageType> = ( { message } ) => {
  const { id, text, uid, photoURL, type } = message;

  return (<>
    <div key={id} className={`message ${type}`}>
      <img className="msgIcon" src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default ChatMessage;