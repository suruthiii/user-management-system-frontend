export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  status: "ACTIVE" | "PENDING";
  userRoleId: number;
  userRole: { id: number; name: string };
}
