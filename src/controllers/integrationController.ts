import express,{Request, Response, NextFunction} from "express"

export const integration = (req: Request, res: Response, next: NextFunction) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = {
        data: {
            descriptions: {
                app_name: "Word-Repeater",
                app_description: "A message formatter bot that processes incoming messages and sends back formatted responses.",
                app_url: baseUrl,
                app_logo: "https://textcompare.io/img/word-repeater.png",
                background_color: "#fff"
            },
            key_features: [
                "Receive messages from Telex channels.",
                "Format messages based on predefined templates or logic.",
                "Send formatted responses back to the channel.",
                "Log message formatting activity for auditing purposes."
            ],
            author: "Precious Ifeanyi",
            integration_category: "task automation",
            integration_type: "modifier",
            settings: [
                {
                "label": "maxMessageLength",
                "type": "number",
                "required": true,
                "default": 100
                },
                {
                "label": "repeatWords",
                "type": "multi-select",
                "required": true,
                "default": "world,happy"
                },
                {
                "label": "noOfRepetitions",
                "type": "number",
                "required": true,
                "default": 2
                }
            ],
            target_url: `${baseUrl}/format-message`
        }
    }
    res.json(data) 

}