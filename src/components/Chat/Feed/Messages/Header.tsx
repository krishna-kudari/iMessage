import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import ConversationOperations from "@/src/graphql/operations/conversation";
import * as React from "react";
import { ConverationData } from "@/src/util/types";
import { Button, Stack, Text } from "@chakra-ui/react";
import { formatUsernames } from "@/src/util/functions";

interface IMessagesHeaderProps {
  userId: string;
  conversationId: string;
}

const MessagesHeader: React.FunctionComponent<IMessagesHeaderProps> = ({
  userId,
  conversationId,
}) => {
  const router = useRouter();
  const { data, loading } = useQuery<ConverationData, null>(
    ConversationOperations.Query.conversations
  );

  const conversations = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  if (data?.conversations && !loading && !conversations) {
    router.replace(process.env.NEXT_PUBLIC_BASE_URL as string);
  }
  return (
    <Stack
      direction={"row"}
      align={"center"}
      spacing={6}
      py={5}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor={"whiteAlpha.200"}
    >
      <Button
        display={{ md: "none" }}
        onClick={() =>
          router.replace("?conversationId", "/", {
            shallow: true,
          })
        }
      >
        Back
      </Button>
      {/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />} */}
      {!conversations && !loading && <Text>Conversation Not Found</Text>}
      {conversations && (
        <Stack>
            <Text>To: </Text>
            <Text>{formatUsernames(conversations.participants, userId)}</Text>
        </Stack>
      )}
    </Stack>
  );
};

export default MessagesHeader;
