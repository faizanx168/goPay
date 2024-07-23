import { Card } from "@repo/ui/card";

export const UserProfile = ({ profile }: any) => {
  return (
    <Card title="User Profile">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <span>Name:</span>
          <span>{profile.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Email:</span>
          <span>{profile.email}</span>
        </div>
        <div className="flex justify-between">
          <span>Phone:</span>
          <span>{profile.phone}</span>
        </div>
      </div>
    </Card>
  );
};
