/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {

    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/booking/checkout-session/${tourId}`,
    );

    // 2) Create checkout form + chanre credit card
    window.location.href = session.data.session.url;
  } catch (err) {
    showAlert('error', err);
  }
};
