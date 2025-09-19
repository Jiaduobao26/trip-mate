import axios from 'axios';
import { auth } from "../lib/firebase";

const base = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: base,
});

// Attach a request interceptor to handle requests before they are sent
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // Attempt to refresh the token and retry the request once
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config); // Request again
        }
      } catch (e) {
        console.error("Token refresh failed, log out user");
        await auth.signOut();
        // Redirect to home page
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export async function getAttractions(payload) {
  const res = await api.post(`${base}/attractions_mock`, payload);
  return res;
}

export async function getTripPlan(payload) {
  const res = await api.post(`${base}/itinerary`, payload);
  return res;
}

export async function createTrip(payload) {
  const res = await api.post(`${base}/trips/setup`, payload);
  return res;
}

export async function getTrip({ id }) {
  // const res = await api.get(`${base}/trips/${id}`);
  // return res;
  return Promise.resolve({
    success: true,
    data: {
      destination: "San Francisco",
      duration: 8,
      interests: ["ChIJmRyMs_mAhYARpViaf6JEWNE"]
    },
  });
}

export async function getTripAttractions({ id }) {
  // const res = await api.get(`${base}/trips/${id}/attractions`);
  const res = await fetch("/mock/attractions.json").then(r => r.json());
  return res;
}

export async function getTripProcess({ id }) {
  // const res = await api.get(`${base}/trips/${id}/progress`);
  // return res;

  const trip = {
    id,
    status: Math.random() > 0.7 ? "ready" : "processing",
  };


  const progress = trip.status === "ready"
    ? 100
    : Math.floor(Math.random() * 100);

  return Promise.resolve({
    success: true,
    data: {
      status: trip.status,
      progress,
    },
  });
}
