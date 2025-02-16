import express,{Request, Response, NextFunction} from "express"

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

  export const processMessage = (req: Request, res: Response): any => {
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
