import { User } from "./Users";

export const getAllUsers = async () => {
  const response = await fetch("/api/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data;
};

export const addAllUsers = async (user: User) => {
  const response = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data as User;
};
