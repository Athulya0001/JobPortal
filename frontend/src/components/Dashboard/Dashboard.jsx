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
      {/* {isSignedIn && !user?.role  ? (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Select Your Role</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Choose a role</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
              disabled={!role}
            >Set Role
            </button>
          </form>
        </div>
      ) } */}
    </div>
  );
};

export default Dashboard;