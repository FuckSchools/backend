export type ThreadEntity =
{
  id: string;
  messages: MessageEntity[];
  createdAt: Date;
}

export type MessageEntity = {
  id: string;
  threadId: string;
  sender: MessageSenderEntity;
  content: string;
  createdAt: Date;
}

const MessageSenderEntity = {
  "USER": "USER",
  "CODING_AGENT": "CODING_AGENT",
  "TOOL": "TOOL",
  "EXTERNAL_AGENT": "EXTERNAL_AGENT",
  "BACKGROUND_AGENT": "BACKGROUND_AGENT",
} as const;

export type MessageSenderEntity = typeof MessageSenderEntity[keyof typeof MessageSenderEntity];