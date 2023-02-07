import { MessagePopulated } from "@/../backend/src/util/types";
import { Avatar, Flex, Stack, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";
import React from "react";

interface MessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
}
const formatRelativeLocale = {
  lastWeek: "eeee t p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};
const MessageItem: React.FC<MessageItemProps> = ({ message, sentByMe }) => {
  return (
    <Stack
      direction={"row"}
      p={4}
      spacing={4}
      _hover={{ bg: "whiteAlpha.200" }}
      wordBreak="break-word"
    >
      {!sentByMe && (
        <Flex>
          <Avatar size={"sm"} />
        </Flex>
      )}
      <Stack spacing={1} width={"100%"}>
        <Stack
          direction={"row"}
          align="center"
          // justify={}
        >
          {!sentByMe && (
            <Text fontWeight={500} textAlign={"left"}>
              {message.sender.username}
            </Text>
          )}
          <Text fontSize={"2xs"} color="whiteAlpha.700">
            {formatRelative(message.createdAt, new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
