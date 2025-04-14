import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const SigninWarn = () => {
  const toastShown = useRef(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!toastShown.current) {
      toast.warning("Please Sign in to continue");
      toastShown.current = true;

      setTimeout(() => {
        setRedirect(true);
      }, 2000);
    }
  }, []);

  if (redirect) {
    return <Navigate to="/auth" />;
  }

  return null;
};

export default SigninWarn;