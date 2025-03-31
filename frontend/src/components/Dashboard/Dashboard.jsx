import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <SignedIn>
        <div className="p-6">
          <h1 className="text-xl font-bold">Welcome to Dashboard</h1>
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <Navigate to="/auth" />
      </SignedOut>
    </div>
  );
};

export default Dashboard;