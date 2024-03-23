import { convertIsoToTime } from "../../../../../utils/functions/handleTimeConversion";
import { prepareUrl } from "../../../../../utils/utils";
import "./ChatMessage.css";
const ChatMessage: React.FC<any> = ({ data }) => {
  const { userType, username, timestamp, message, image } = data;
  return (
    <div className="chat-message" data-user-type={userType}>
      <div className="chat-message-content">
        <div className="chat-message-image">
          <div className="chat-message-image-content">
            <img src={prepareUrl(image)} alt="user avatar" />
          </div>
        </div>
        <div className="chat-message-infos">
          <div className="chat-message-header">
            <div className="chat-message-username">{username}</div>
            <p className="chat-message-timestamp">
              {convertIsoToTime(timestamp)}
            </p>
          </div>
          <div className="chat-message-body">
            <div className="chat-message-text">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
