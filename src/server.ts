import app from "./config/app.config"
import dotenv from "dotenv"

dotenv.config()

app.listen(process.env.PORT, () => {
    console.log(`Server listening on ${process.env.PORT}`)
})