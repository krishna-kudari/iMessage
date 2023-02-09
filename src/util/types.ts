// import {
  // ConversationPopulated,
  // MessagePopulated
// } from "../../../backend/src/util/types";

/*
 * Users
 */

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}

/* Converation
 */

export interface ParticipantPopulated {
  hasSeenLatestMessage: boolean;
  user: {
    id: string;
    username: string;
  },
}
export interface Message {
  body:string;
  createdAt: Date;
  id: string;
  sender: {
    id: string;
    username: string;
  }
}
export interface ConversationPopulated {
    id: string;
    participants: Array<ParticipantPopulated>;
    latestMessage: Message | null;
    updateAt: Date;
    createdAt: Date;
}

export interface ConverationData {
  conversations: Array<ConversationPopulated>;
}
export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: ConversationPopulated;
  }
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  }
}

/**
 * Messages
 */

export interface MessagePopulated {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  updateAt: Date;
  sender: {
    id: string;
    username: string | null;
};
}
export interface MessagesData {
  messages: Array<MessagePopulated>;
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}
