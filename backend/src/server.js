import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express';


const app = express();

app.use(express.json()); // req.user
app.use(clerkMiddleware()); // req.auth will be available in the reqest object

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const startServer = async () => {
  try {
    await connectDB();
    if (!ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${ENV.PORT}`);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
