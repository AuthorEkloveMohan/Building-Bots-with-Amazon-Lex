const messages = {
  closing: {
    closing: [
      {
        order: 1,
        message: {
          contentType: "ImageResponseCard",
          imageResponseCard: {
            title:
              "Hi, welcome to Indesha’s amazing bot. I can help answer on below topics.",
            buttons: [
              {
                text: "Leave Policy",
                value: "Leave Policy",
              },
              {
                text: "Work from Home Guidelines",
                value: "WFH",
              },
              {
                text: "Reimbursements",
                value: "Reimbursment",
              },
            ],
          },
        },
      },
    ],
  },
};

module.exports = {
  messages,
};