import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationsList from "./ConversationList";
import ConversationOperations from "@/src/graphql/operations/conversation";
import { ConverationData } from "@/src/util/types";
import { ConversationPopulated } from "@/../backend/src/util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
interface IConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<IConversationsWrapperProps> = ({
  session,
}) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConverationData, null>(
    ConversationOperations.Query.conversations
    );
    const router = useRouter();
    const { query: {conversationId}} = router;
    const onViewConversation = async (conversationId: string) => {
      /**
       * 1. push the conversationId to route query params
       */
      router.push({query: {conversationId}});
      /**
       * 2, Mark the conversation as read
       */
    }
    console.log("HERE IS DATA FROM CONVERSATIONWRAPPER:📬", conversationsData);
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;
        console.log("HERE IS SUBSCRIPTION DATA:🧧🎟️♨️",subscriptionData);
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };
  

  useEffect(()=>{
    subscribeToNewConversations();
  },[]);

  return (
    <Box
      display={{base: conversationId ? "none" : "flex" , md: "flex"}}
      width={{ base: "100%", md: "400px" }}
      bg={"whiteAlpha.50"}
      py={6}
      px={3}
    >
      <ConversationsList
        session={session}
        conversations={conversationsData?.conversations || []}
        onViewConversation={onViewConversation}
      />
    </Box>
  );
};

export default ConversationsWrapper;
