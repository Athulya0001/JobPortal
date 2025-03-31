import { useClerk } from "@clerk/clerk-react";

const Logout = () => {
  const { signOut } = useClerk();

  return (
    <button 
      onClick={() => signOut()} 
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
};

export default Logout;