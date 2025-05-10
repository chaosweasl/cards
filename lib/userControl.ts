"use server";

function isAlphaNumeric(x: string): boolean {
  const regex = /^[a-zA-Z0-9]*$/;

  return regex.test(x);
}

export async function register(prevState, formData: FormData) {
  console.log("registering user...");

  type Errors = {
    username: string | null;
    password: string | null;
  };

  const errors: Errors = {
    username: null,
    password: null,
  };

  const ourUser = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  if (typeof ourUser.username != "string") {
    ourUser.username = "";
  }

  if (typeof ourUser.password != "string") {
    ourUser.password = "";
  }

  ourUser.username = ourUser.username.trim();
  ourUser.password = ourUser.password.trim();

  if (ourUser.username === "") {
    errors.username = "You must provide an username.";
  } else if (!isAlphaNumeric(ourUser.username)) {
    errors.username = "Username can only contain letters and numbers.";
  } else if (ourUser.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  } else if (ourUser.username.length > 30) {
    errors.username = "Username cannot exceed more than 30 characters";
  }

  if (ourUser.password === "") {
    errors.password = "You must provide a password.";
  } else if (ourUser.password.length < 12) {
    errors.password = "Password must be at least 12 characters";
  } else if (ourUser.password.length > 50) {
    errors.password = "Password cannot exceed more than 50 characters";
  }

  if (errors.username || errors.password) {
    return {
      errors: errors,
      success: false,
    };
  }

  //storing a new user in the db

  //log the user in by giving them a cookie

  return {
    success: true,
  };
}
