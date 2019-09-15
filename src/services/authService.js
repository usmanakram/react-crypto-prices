import http from "./httpService";
import jwtDecode from "jwt-decode";
// import { apiUrl } from "../config.json";
// import { toast } from "react-toastify";

// const apiEndpoint = "/auth";
// const apiEndpoint = "/react-login";
const apiEndpoint = "/auth/login";
const tokenKey = "token";

http.setJwt(getJwt());

async function login(username, password) {
  // const data = JSON.stringify({ bit_uname: username, bit_password: password });

  const formData = new FormData();
  formData.append("bit_uname", username);
  formData.append("bit_password", password);

  /* return http
    .post(apiEndpoint, formData)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    }); */

  const { data } = await http.post(apiEndpoint, formData);
  localStorage.setItem(tokenKey, data.access_token);
}

function logout() {
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
