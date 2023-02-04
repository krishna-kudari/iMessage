import {
  CreateConversationData,
  CreateConversationInput,
  SearchedUser,
  SearchUsersData,
  SearchUsersInput,
} from "@/src/util/types";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from "../../../../graphql/operations/user";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import ConversationsOperations from "@/src/graphql/operations/conversation";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FunctionComponent<IModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const {
    user: { id: userId },
  } = session;

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);
  console.log("DATA FROM SEARCHUSERS", data);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationsOperations.Mutations.createConversation
    );

  const onCreateConversation = async () => {
    const participantIds = [userId, ...participants.map((p) => p.id)];
    try {
      //createconversation mutation
      const { data } = await createConversation({
        variables: { participantIds },
      });
      console.log("CREATECONVERSATION DATA🙌🆎", data);
      if (!data?.createConversation) {
        throw new Error("Failed to Create Conversation🛑🛑");
      }
      const {
        createConversation: { conversationId },
      } = data;
      router.push({ query: { conversationId } });
      /* 
      Clear state and close modal
      on successfull creation */
      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error: any) {
      console.log("ONCREATE CONVERSATIIION ERROR:🦀🦞", error);
      toast.error(error?.message);
    }
  };

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    //search
    console.log("Searching..🔍🔎");
    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    console.log("ADD PARTICIPANT:📥");
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#2d2d2d"} pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter a username"
                />
                <Button type="submit" isDisabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {!!participants.length && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width={"100%"}
                  mt={6}
                  _hover={{ bg: "brand.100" }}
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
