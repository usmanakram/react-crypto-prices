import http from "./httpService";
import jwtDecode from "jwt-decode";
// import debug from "../utils/debuger";

// import { apiUrl } from "../config.json";
// import { toast } from "react-toastify";
// import qs from "qs";

// const apiEndpoint = "/auth";
// const apiEndpoint = "/react-login";
// const apiEndpoint = "/auth/login";
const apiEndpoint = {
  login: "/auth/login",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  logout: "/auth/logout",
  signup: "/auth/signup",
  getUser: "/auth/user",
};
const tokenKey = "token";

http.setJwt(getJwt());

function setFormData(data) {
  const formData = new FormData();
  for (let [key, value] of Object.entries(data)) formData.append(key, value);
  return formData;
}

async function login(username, password) {
  // 1st Cases (Content-Type: application/x-www-form-urlencoded)
  // const formData = `bit_uname=${username}&bit_password=${password}`;

  // 2nd Cases (Content-Type: application/x-www-form-urlencoded)
  // const formData = qs.stringify({ bit_uname: username, bit_password: password });

  // 3rd Cases (Content-Type: multipart/form-data; boundary=----WebKitFormBoundarydBgA8CMJMGMEFFX4)
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  // Wrong format
  // const formData = { bit_uname: username, bit_password: password };

  // Promise
  /* return http
    .post(apiEndpoint.login, formData)
    .then(response => {
      debug.log(response);
    })
    .catch(error => {
      debug.log(error);
    }); */

  // async/await
  const { data } = await http.post(apiEndpoint.login, formData);
  localStorage.setItem(tokenKey, data.access_token);
}
async function forgotPassword(email) {
  const formData = new FormData();
  formData.append("email", email);

  const { data } = await http.post(apiEndpoint.forgotPassword, formData);
  return data;
}
async function resetPassword(email, code, password) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("code", code);
  formData.append("password", password);

  const { data } = await http.post(apiEndpoint.resetPassword, formData);
  return data;
}
async function signup(
  username,
  password,
  firstname,
  lastname,
  email,
  gender
  // referrer_username
) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("firstname", firstname);
  formData.append("lastname", lastname);
  formData.append("email", email);
  formData.append("gender", gender);
  // formData.append("referrer_username", referrer_username);

  const { data } = await http.post(apiEndpoint.signup, formData);
  return data;
}

async function getProfile() {
  const { data } = await http.get("auth/profile");
  return data;
}

async function updateProfile(params) {
  console.log("params");
  console.log(params);
  const formData = setFormData(params);
  const { data } = await http.post("/auth/update-profile", formData);
  return data;
}
// async function updateProfile(
//   name,
//   contact_number,
//   address,
//   id_doc,
//   selfie_doc
// ) {
//   const formData = new FormData();
//   formData.append("name", name);
//   formData.append("contact_number", contact_number);
//   formData.append("address", address);
//   // formData.append("identity_document", id_doc);
//   // formData.append("selfie_document", selfie_doc);

//   const { data } = await http.post("/auth/update-profile", formData);
//   return data;
// }

async function getUser() {
  const user = this.getCurrentUser();
  if (user === null) return null;

  const { data } = await http.get(apiEndpoint.getUser);
  return data;
}

async function logout() {
  try {
    await http.get(apiEndpoint.logout);
  } catch (ex) {}

  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  // debug.log("getCurrentUser called");
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  getUser,
  logout,
  getCurrentUser,
  getJwt,
};
