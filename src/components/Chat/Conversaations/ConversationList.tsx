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
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined,
  ) => void;
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

  const sortedConversations = [...conversations].sort((a,b)=>b.updateAt.valueOf() - a.updateAt.valueOf());
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
      {sortedConversations.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );
        return (
          <ConversationItem
            userId={userId}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage
              )
            }
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === router.query.conversationId}
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            // onDeleteConversation={function (conversationId: string): void {
            //   throw new Error("Function not implemented.");
            // }}
          />
        );
      })}
    </Box>
  );
};

export default ConversationsList;
