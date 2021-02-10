import { Button, Drawer } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { UserForm } from "./UserForm";
import styles from "./Users.module.css";
import { getAllUsers } from "./usersApi";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export const Users = () => {
  const [visible, setVisible] = useState(false);

  const users = useQuery<User[], Error>("users", () => getAllUsers(), {
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  if (users.isLoading) {
    return <div>Loading</div>;
  }
  if (users.isError) {
    return <div>{users.error.message}</div>;
  }
  return (
    <>
      <div className={styles.content}>
        {users.data?.map((user) => (
          <li>
            User: {user.name} | Email: {user.email}
          </li>
        ))}
      </div>
      <Button type="primary" size="large" onClick={() => setVisible(true)} className={styles.button}>
        Add
      </Button>
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        width={600}
      >
        <UserForm />
      </Drawer>
    </>
  );
};
