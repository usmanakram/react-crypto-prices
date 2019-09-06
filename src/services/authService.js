import http from "./httpService";
import jwtDecode from "jwt-decode";
// import { apiUrl } from "../config.json";

// const apiEndpoint = "/auth";
const apiEndpoint = "/react-login";
const tokenKey = "token";

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

  const data = await http.post(apiEndpoint, formData);
  console.log(data);
  // localStorage.setItem(tokenKey, jwt.token);
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getJwt() {
  return localStorage.getItem(tokenKey);
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

export default {
  login,
  logout,
  getCurrentUser,
  getJwt
};
