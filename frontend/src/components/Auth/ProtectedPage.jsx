import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const ProtectedPage = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      const response = await fetch("http://localhost:3000/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return <div>{data ? JSON.stringify(data) : "Loading..."}</div>
};

export default ProtectedPage;