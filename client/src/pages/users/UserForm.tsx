import { Button, Form, Input } from "antd";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { User } from "./Users";
import { addAllUsers } from "./usersApi";

export const UserForm = () => {
  const cache = useQueryClient();
  // typescript
  // 1. What is returned
  // 2. Error
  // 3. what is send
  const addUser = useMutation<User, Error, User>((user) => addAllUsers(user));

  // const addUser = useMutation<User, Error, User>(addAllUsers, {
  //   onMutate: user => {
  //     // A mutation is about to happen!
  //     // Optionally return a context containing data to use when for example rolling back
  //     return { id: 1 }
  //   },
  //   onError: (error, variables, context) => {
  //     // An error happened!
  //     console.log(`rolling back optimistic update`)
  //   },
  //   onSuccess: (data, variables, context) => {
  //     // Boom baby!
  //   },
  //   onSettled: (data, error, variables, context) => {
  //     // Error or success... doesn't matter!
  //   },
  // })

  const onFinish = async (values: User) => {
    console.log("Success:", values);
    try {
      const response = await addUser.mutateAsync(values);
      cache.invalidateQueries('users');
    } catch (error) {
      console.error(error);
    } finally {
      console.log("done");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
  };
  const tailLayout = {
    wrapperCol: { offset: 0, span: 16 },
  };
  return (
    <>
      {addUser.isLoading && <h5>LOADING</h5>}
      {addUser.error && <h5 onClick={() => addUser.reset()}>{addUser.error.message}</h5>}
      <Form
        {...layout}
        name="users"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout={"vertical"}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
