const { UserInputError, AuthenticationError } = require("apollo-server");

const { User, Message } = require("../../models");

module.exports = {
  Query: {
    getMessages: async (_, __, { user }) => {},
  },
  Mutation: {
    sendMessage: async (_, { to, content }, { user }, info) => {
      if (!user) throw new AuthenticationError("Unauthenticated");
      const recipient = await User.findOne({ where: { username: to } });
      if (!recipient) {
        throw new UserInputError("User not found");
      } else if (recipient.username === user.username) {
        throw new UserInputError("can't message yourself");
      }
      if (content.trim() === "") throw new UserInputError("content is empty");
      const message = await Message.create({
        from: user.username,
        to,
        content,
      });
      return message;
    }, //End SendMessage
  },
};
