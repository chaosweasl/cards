"use server";

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

  if (ourUser.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  } else if (ourUser.username.length > 30) {
    errors.username = "Username cannot exceed more than 30 characters";
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
