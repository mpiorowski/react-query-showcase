import { Button, Drawer } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { UserForm } from "./UserForm";
import styles from "./Users.module.css";
import { getAllUsersApi } from "./usersApi";
import { setUser } from "./userSlice";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export const UsersList = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const users = useQuery<User[], Error>("users", () => getAllUsersApi(), {
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  if (users.isLoading) {
    return <div>Loading</div>;
  }
  return (
    <>
      {users.isError && <h5>{users.error.message}</h5>}
      <div className={styles.content}>
        {users.data?.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              dispatch(setUser(user));
              setVisible(true);
            }}
          >
            User: {user.name} | Email: {user.email}
          </li>
        ))}
      </div>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          dispatch(setUser(null));
          setVisible(true);
        }}
        className={styles.button}
      >
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
