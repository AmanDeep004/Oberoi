import React, { useEffect } from "react";
import ElasticBot from "./oberoiBot.js";

const ChatMessageWidget = () => {
  useEffect(() => {
    const elasticBot = new ElasticBot({
      position: "bottom-right",
      clientId: "804493",
      eventId: "",
      isExpand: true,
      onRefresh: (params) => {
        console.log("parameter", params);
      },
    });

    return () => {
      if (elasticBot.destroy) {
        elasticBot.destroy();
      }
    };
  }, []);

  return <div id="elastic-bot-container"></div>;
};

export default ChatMessageWidget;
