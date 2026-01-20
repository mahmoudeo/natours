/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Logged in successfully!');
        location.href = '/';
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/logout',
    });
    if ((res.data.status = 'success')) {
      window.setTimeout(() => {
        location.href = '/';
        showAlert('success', 'Logged out successfully!');
      }, 1500);
    };
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
