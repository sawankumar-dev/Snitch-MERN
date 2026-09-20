import app from "./app/app.js";
import config from "./app/config/config.js";
import { connectDB } from "./app/config/db.js";

connectDB().then(() => {
    console.log("✅ DB is connected successfully!")
    app.listen(config.PORT, () => {
    console.log("🚀 Server is running on 3000 port.")
})
})
