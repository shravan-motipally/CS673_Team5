import * as React from 'react';
import qbot from "../screens/images/qbot-temp.png";

const Typing = () => (
  <div className={`message received at_the_top`}>
    <img className="msgIcon" src={qbot} />
    <div className="typing">
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
      <div className="typing__dot"></div>
    </div>
  </div>
)

export default Typing;