import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import User from "../models/userModel.js";

const requireAuth = ClerkExpressWithAuth({
  async onAuth(auth, req, res) {
    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId: auth.userId });

    if (!user) {
      return res.status(403).json({ error: "User is not registered" });
    }

    req.user = user; // Attach user data to request
  }
});

export default requireAuth;
