import { Button, Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import ConversationsWrapper from "./Conversaations/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

interface IChatProps {
  session: Session
}

const Chat: React.FC<IChatProps> = ({session }) => {
  return (
    <Flex height="100vh">
      <ConversationsWrapper session={session}/>
      <FeedWrapper session={session} />
    </Flex>
  );
};

export default Chat;
