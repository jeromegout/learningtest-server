const bcrypt = require("bcrypt");

const buildName = email => email.split("@")[0];

const defaultAvatar = email =>
  `https://avatars.dicebear.com/v2/bottts/${bcrypt.hashSync(email, 9)}.svg`;

exports.createUser = (email, password) => {
  return {
    email,
    password,
    name: buildName(email),
    avatar: defaultAvatar(email),
  };
};
