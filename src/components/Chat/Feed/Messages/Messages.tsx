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
import MessageItem from "./MessageItem";

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
          messages:newMessage.sender.id === userId ? prev.messages: [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToMoreMessages(conversationId);
  }, [conversationId]);
  
  if (error) return null;
  return (
    <Flex direction={"column"} justify="flex-end" overflow={"hidden"}>
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" width="100%" />
          {/* <span>LOADING MESSAGES</span> */}
        </Stack>
      )}
      {data?.messages && (
        <Flex
          direction={"column-reverse"}
          overflowY="scroll"
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
              background:"transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "grey",
              borderRadius: "24px",
            },
          }}
          height={"100%"}
        >
          {data.messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
            // <div>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
