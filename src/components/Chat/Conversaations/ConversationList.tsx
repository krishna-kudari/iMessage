// import { ConversationPopulated } from "@/../backend/src/util/types";
import { ConversationPopulated } from "@/src/util/types";
import { iMessageLogo } from "@/public";
import { useMutation } from "@apollo/client";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/Modal";
import ConverdsationOperations from "@/src/graphql/operations/conversation";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

interface IConversationsListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
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

  const [deleteConversation] = useMutation<
    {
      deleteConversation: boolean;
    },
    {
      conversationId: string;
    }
  >(ConverdsationOperations.Mutations.deleteConversation);

  const onDeleteConversation = async (conversationId: string) => {
    console.log("ondelete called", conversationId);
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation Deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error: any) {
      console.log("onDeleteconversation ERROR", error);
      throw new Error(error.message);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updateAt.valueOf() - a.updateAt.valueOf()
  );

  return (
    <Box width={"100%"} position="relative" height={"100%"}>
      <Box
        mb={4}
        borderRadius={4}
        cursor={"pointer"}
        onClick={onOpen}
        display="flex"
        flexDirection="row"
        alignItems={"center"}
        mt={-4}
      >
        <Image src={iMessageLogo.src} height="50px"></Image>
        <Box height="40px" flexGrow={1} overflow={"hidden"} px={2} py={1}>
          <Text
            bg={"blackAlpha.300"}
            py={2}
            px={4}
            borderRadius={4}
            textAlign={"center"}
            color="whiteAlpha.800"
          >
            Find or start a Conversation
          </Text>
        </Box>
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
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}
      <Box position={"absolute"} bottom={0} left={0} px="6" width="100%">
        <Button
          width={"100%"}
          onClick={() => signOut()}
          leftIcon={<FiLogOut></FiLogOut>}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationsList;
