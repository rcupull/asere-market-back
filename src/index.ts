import { connectDB } from "./db";
import { app } from "./server";

const PORT = process.env.PORT || "4009";

connectDB();

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
