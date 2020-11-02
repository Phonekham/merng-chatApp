const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { User } = require("../models");

module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      if (context.req && context.req.headers.authorization) {
        const token = context.req.headers.authorization.split("Bearer ")[1];
        jwt.verify(token, "secretKey", (err, decodedToken) => {
          if (err) {
            throw new AuthenticationError("UnAuthenticated");
          }
          user = decodedToken;
        });
      }
      try {
        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });
        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args, context, info) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        if (email.trim() === "") errors.email = "Email mus not empty";
        if (username.trim() === "") errors.username = "username mus not empty";
        if (password.trim() === "") errors.password = "password mus not empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "confirmPassword must not empty";
        if (confirmPassword !== password)
          errors.confirmPassword = "password not match";

        const userByUsername = await User.findOne({ where: { username } });
        const userByEmail = await User.findOne({ where: { email } });

        if (userByUsername) errors.username = "username is taken";
        if (userByEmail) errors.email = "email is taken";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        password = await bcrypt.hash(password, 6);
        const user = await User.create({ username, email, password });
        return user;
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (error.name === "SequelizeValidationError") {
          error.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("bad input", { errors: error });
      }
    },
    login: async (_, args, context, info) => {
      const { username, password } = args;
      let errors = {};
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
          errors.username = "user not found";
          throw new AuthenticationError("password is incorrect", { errors });
        }
        const token = jwt.sign({ username }, "secretKey", {
          expiresIn: 60 * 60,
        });
        user.token = token;
        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (error) {
        throw error;
      }
    },
  },
};
