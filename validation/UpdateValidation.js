function Validation(values) {
  let error = {};

  const password_pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!values.name || values.name.trim() === "") {
    error.name = "Name should not be empty";
  } else {
    error.name = "";
  }

  if (!values.password || values.password.trim() === "") {
    error.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password =
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
  } else {
    error.password = "";
  }

  if (!values.rePassword || values.rePassword.trim() === "") {
    error.rePassword = "Please confirm your password";
  } else if (values.password !== values.rePassword) {
    error.rePassword = "Passwords do not match";
  } else {
    error.rePassword = "";
  }

  return error;
}

export default Validation;
