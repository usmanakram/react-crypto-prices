import http from "./httpService";
import jwtDecode from "jwt-decode";
// import { apiUrl } from "../config.json";
// import { toast } from "react-toastify";
// import qs from "qs";

// const apiEndpoint = "/auth";
// const apiEndpoint = "/react-login";
// const apiEndpoint = "/auth/login";
const apiEndpoint = {
  login: "/auth/login",
  logout: "/auth/logout"
};
const tokenKey = "token";

http.setJwt(getJwt());

async function login(username, password) {
  // 1st Cases (Content-Type: application/x-www-form-urlencoded)
  // const formData = `bit_uname=${username}&bit_password=${password}`;

  // 2nd Cases (Content-Type: application/x-www-form-urlencoded)
  // const formData = qs.stringify({ bit_uname: username, bit_password: password });

  // 3rd Cases (Content-Type: multipart/form-data; boundary=----WebKitFormBoundarydBgA8CMJMGMEFFX4)
  const formData = new FormData();
  formData.append("bit_uname", username);
  formData.append("bit_password", password);

  // Wrong format
  // const formData = { bit_uname: username, bit_password: password };

  // Promise
  /* return http
    .post(apiEndpoint.login, formData)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    }); */

  // async/await
  const { data } = await http.post(apiEndpoint.login, formData);
  localStorage.setItem(tokenKey, data.access_token);
}

async function logout() {
  try {
    await http.get(apiEndpoint.logout);
  } catch (ex) {}

  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  // console.log("getCurrentUser called");
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
  login,
  logout,
  getCurrentUser,
  getJwt
};
