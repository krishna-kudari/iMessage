import {
  MessagesData,
  MessagesVariables,
  MessageSubscriptionData,
} from "@/src/util/types";
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import MessageOperaions from "@/src/graphql/operations/message";
import { toast } from "react-hot-toast";
import SkeletonLoader from "@/src/components/common/SkeletonLoader";
import { useEffect } from "react";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperaions.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
  if (error) return null;

  const subscribeToMoreMessages = (conversationId: string) => {
    subscribeToMore({
      document: MessageOperaions.Subscription.messegeSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;
        console.log("SUBCRIPTION MESSAGES:🔥", subscriptionData);
        const newMessage = subscriptionData.data.messageSent;
        return Object.assign({}, prev, {
          messages: [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToMoreMessages(conversationId);
  }, [conversationId]);
  return (
    <Flex direction={"column"} justify="flex-end" overflow={"hidden"}>
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" width="100%" />
          {/* <span>LOADING MESSAGES</span> */}
        </Stack>
      )}
      {data?.messages && (
        <Flex direction={"column-reverse"} overflowY="scroll" height={"100%"}>
          {data.messages.map((message) => (
            // <MessageItem />
            <div>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
