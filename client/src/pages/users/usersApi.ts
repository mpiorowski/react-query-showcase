import { User } from "./Users";

export const getAllUsersApi = async () => {
  const response = await fetch("/api/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data;
};

export const getUserApi = async (userId: string) => {
  const response = await fetch("/api/users/" + userId, {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const addUserApi = async (user: User) => {
  const response = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data as User;
};

export const editUserApi = async (userId: string, user: User) => {
  const response = await fetch("/api/users/" + userId, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data as User;
};
