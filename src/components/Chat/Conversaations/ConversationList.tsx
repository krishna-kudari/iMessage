import { ConversationPopulated } from "@/../backend/src/util/types";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/Modal";
interface IConversationsListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string) => void;
}

const ConversationsList: React.FunctionComponent<IConversationsListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    user: { id: userId },
  } = session;
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box>
      <Box
        py={2}
        px={4}
        mb={4}
        bg={"blackAlpha.300"}
        borderRadius={4}
        cursor={"pointer"}
        onClick={onOpen}
      >
        <Text textAlign={"center"} color="whiteAlpha.800">
          Find or start a Conversaation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      {conversations.map((conversation) => (
        <ConversationItem
          userId={userId}
          onClick={() => onViewConversation(conversation.id)}
          key={conversation.id}
          conversation={conversation}
          isSelected={conversation.id === router.query.conversationId}
          // hasSeenLatestMessage={undefined}
          // onDeleteConversation={function (conversationId: string): void {
          //   throw new Error("Function not implemented.");
          // }}
        />
      ))}
    </Box>
  );
};

export default ConversationsList;
