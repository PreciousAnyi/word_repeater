import express from "express"
import cors from "cors"
import { processMessage } from "../controllers/formatMessageController";
import { integration } from "../controllers/integrationController";


const app = express();
app.use(express.json());
app.use(cors());

app.use('/integration', integration );

app.use("/format-message", processMessage);

export default app;
