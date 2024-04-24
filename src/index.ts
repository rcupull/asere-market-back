import { connectDB } from "./db";
import { app } from "./server";

const NODE_ENV = process.env.NODE_ENV;

export const getPort = () => {
  if (NODE_ENV === "production") {
    return "80";
  }

  if (NODE_ENV === "staging") {
    return "8080";
  }

  return "4009";
};

const PORT = getPort();

connectDB();

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
