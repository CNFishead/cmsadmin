import MemberType from "./MemberType";
import User from "./UserType";

export default interface FamilyType {
  _id: string;
  name: string;
  user: User;
  members: MemberType[];
  contact: MemberType;
  notes: string[];
  tags: string[];
}
