import express,{Request, Response, NextFunction} from "express"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());
interface Setting {
    label: string;
    type: string;
    default: any;
    required: boolean;
  }
  
  interface MessageRequest {
    channel_id: string;
    settings: Setting[];
    message: string;
  }

  const processMessage = (req: Request, res: Response): any => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  
    const { channel_id, settings, message } = req.body as MessageRequest;
  
    if (!channel_id || !settings || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    let maxMessageLength = 500;
    let repeatWords: string[] = [];
    let noOfRepetitions = 1;
  
    settings.forEach(setting => {
      if (setting.label === "maxMessageLength" && typeof setting.default === "number") {
        maxMessageLength = setting.default;
      }
      if (setting.label === "repeatWords" && typeof setting.default === "string") {
        repeatWords = setting.default.split(",");
      }
      if (setting.label === "noOfRepetitions" && typeof setting.default === "number") {
        noOfRepetitions = setting.default;
      }
    });
  
    let formattedMessage = message;
  
    repeatWords.forEach(word => {
      const regex = new RegExp(`\\b${word.trim()}\\b`, "gi");
      formattedMessage = formattedMessage.replace(regex, word.trim().repeat(noOfRepetitions));
    });
  
    if (formattedMessage.length > maxMessageLength) {
      formattedMessage = formattedMessage.substring(0, maxMessageLength);
    }
  
    return res.json({
      event_name: "message_formatted",
      message: formattedMessage,
      status: "success",
      username: "message-formatter-bot"
    });
  };

app.use('/integration', (req: Request, res: Response, next: NextFunction) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = {
        data: {
            descriptions: {
                app_name: "Uptimer",
                app_description: "Monitors website uptime",
                app_url: baseUrl,
                app_logo: "https://play-lh.googleusercontent.com/KierIVfm1zxqKpytzHcvK7Fxaox56OoZrj6rB_kbPXJr--oQgUZK_6uUCX1g8VEbE6lu",
                background_color: "#fff"
            },
            key_features: ["Monitoring"],
            integration_category: "interval",
            integration_type: "interval",
            settings: [
                { label: "site-1", type: "text", required: true, default: "https://www.facebook.com" },
                { label: "site-2", type: "text", required: true, default: "https://google.com" },
                { label: "interval", type: "text", required: true, default: "* * * * *" },
            ],
            target_url: "https://ping.telex.im/v1/webhooks/01950eda-a971-7ab7-a311-748e95abd32a"
        }
    }
    res.json(data) 

} );

app.use("/format-message", processMessage);

export default app;
