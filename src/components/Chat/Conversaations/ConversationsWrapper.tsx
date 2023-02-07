import { gql, useMutation, useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationsList from "./ConversationList";
import ConversationOperations from "@/src/graphql/operations/conversation";
import { ConverationData } from "@/src/util/types";
import { ConversationPopulated, ParticipantPopulated } from "@/../backend/src/util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "../../common/SkeletonLoader";
interface IConversationsWrapperProps {
  session: Session;
}

const ConversationsWrapper: React.FC<IConversationsWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const {
    query: { conversationId },
  } = router;

  const{user:{id :userId}} = session;

  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConverationData, {}>(ConversationOperations.Query.conversations);

  const [markconversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => {
    /**
     * 1. push the conversationId to route query params
     */
    router.push({ query: { conversationId } });
    /**
     * 2, Mark the conversation as read
     */

    if (hasSeenLatestMessage) return;
    //markconversationAsRead mutation
    try {
      await markconversationAsRead({
        variables:{
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants from cache
           */
          const participantsFragment = cache.readFragment<{ participants: Array<ParticipantPopulated>}>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `
          });

          if(!participantsFragment) return;

          const participants = [...participantsFragment.participants];
          
          const userParticipantIdx = participants.findIndex(p => p.user.id === userId);
          
          if(userParticipantIdx === -1)return;

          const userParticipant = participants[userParticipantIdx];
          /**
           * Update participant to show latest message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * update the cache
           */
          cache.writeFragment({
            id:`Conversation:${conversationId}`,
            fragment: gql`
              fragment UUpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants
            }
          })
        }
      })
    }catch(error) {
      console.log("onViewConversationError:👁️",error)
    }
  };
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
        console.log("HERE IS SUBSCRIPTION DATA:🧧🎟️♨️", subscriptionData);
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      bg={"whiteAlpha.50"}
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" />
      ) : (
        // <div>Loading</div>
        <ConversationsList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationsWrapper;
