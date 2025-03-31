import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`http://localhost:4000/api/user/${user.clerkId}`);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, [user]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>Profile Details</h1>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      {profile.role === "recruiter" ? (
        <>
          <p>Company: {profile.companyDetails?.name}</p>
          <p>Location: {profile.companyDetails?.location}</p>
        </>
      ) : (
        <>
          <p>Resume: {profile.resume}</p>
          <p>Skills: {profile.skills?.join(", ")}</p>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
