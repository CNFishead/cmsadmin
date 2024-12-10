import UserType from "./UserType";

export type SupportType = {
  _id: string;
  requester: UserType;
  requesterDetails: {
    email: String;
    fullName: String;
  };
  assignee: UserType;
  groups: SupportGroupType[];
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: [string];
  dateSolved: Date;
};

export type SupportGroupType = {
  _id: string;
  name: string;
  agents: UserType[];
  tickets: SupportType[];
};

export type SupportMessageType = {
  _id: string;
  ticket: SupportType;
  user: UserType;
  message: string;
  sender: {
    fullName: string;
    avatarUrl: string;
  };
  attachments: {
    filename: string;
    url: string;
  }[];
};