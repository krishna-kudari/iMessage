import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
// import { ObjectId } from "bson";
var ObjectID = require("bson-objectid");
import { toast } from "react-hot-toast";
import MessageOperations from "@/src/graphql/operations/message";
import { sendMessageArguments } from "@/../backend/src/util/types";
import { MessagesData } from "@/src/util/types";
interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setMessageBody] = useState("");
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    sendMessageArguments
  >(MessageOperations.Mutation.sendMessage);
  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // call sendMessage mutation
      const {
        user: { id: senderId },
      } = session;
      const messageId = ObjectID().toString();
      const newMessage: sendMessageArguments = {
        id: messageId,
        senderId,
        conversationId,
        body: messageBody,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;
          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  ...newMessage,
                  __typename:"Message",
                  createdAt: new Date(Date.now()),
                  updateAt: new Date(Date.now()),
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                  },
                },
                ...existing.messages,
              ],
            },
          });
        },
      });
      if (!data?.sendMessage || errors) {
        throw new Error("failed to send message");
      }
    } catch (error: any) {
      console.log("onsendMessage error", error);
      toast.error(error.message);
    }
    finally{
      setMessageBody("");
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
          size="md"
          placeholder="New message"
          resize={"none"}
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
