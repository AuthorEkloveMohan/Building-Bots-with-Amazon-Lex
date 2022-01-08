const messages = {
  intents: {
    Welcome: [
      {
        order: 1,
        message: {
          contentType: "PlainText",
          content:
            "Sorry, I am not able to understand your query. Please check back after sometime. Thank you for using Indesha’s amazing bot.",
        },
      },
    ],
    FallbackIntent: [
      {
        order: 1,
        message: {
          contentType: "PlainText",
          content: `Well this is embrassing. I probably need to learn more. Sorry I am not able to help you this time.
          I will improve my knowledge in this area pretty soon. Please try again after some time. Thank you for using Indesha’s amazing bot.`,
        },
      },
    ],
  },
};

module.exports = {
  messages,
};
