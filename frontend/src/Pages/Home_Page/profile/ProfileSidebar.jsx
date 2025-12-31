import { Image } from "react-bootstrap";

const ProfileSidebar = ({ profile }) => (
  <>
    <Image
      src={`https://api.dicebear.com/8.x/initials/svg?seed=${profile.full_name}`}
      roundedCircle
      className="profile-avatar"
    />
    <h5>{profile.full_name}</h5>
    <p className="text-muted">{profile.email_or_phone}</p>
  </>
);

export default ProfileSidebar;
