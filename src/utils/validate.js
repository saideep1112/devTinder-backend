const validator = require("validator");

const validateSignup = async (req) => {
  const { emailId, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("emailid entered is invalid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("password enter is not strong");
  }
};

const validateEditProfile = (req) => {
  const editAllowedFields = [
    "firstName",
    "lastName",
    "age",
    "emailId",
    "skills",
    "mobileNo",
    "photoUrl",
    "gender",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    editAllowedFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignup, validateEditProfile };
