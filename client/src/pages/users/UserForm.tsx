import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { User } from "./Users";
import { addUserApi, editUserApi, getUserApi } from "./usersApi";
import { getUser } from "./userSlice";

export const UserForm = () => {
  const queryClient = useQueryClient();
  const initialUser = useSelector(getUser);
  const userId = initialUser?.id || null;
  const [form] = Form.useForm();

  /**
   * Set initial data for user edit, then make an api call to check for correct data.
   * If no user selected, reset form
   */
  const user = useQuery<User, Error>(["user", userId], () => getUserApi(userId as string), {
    initialData: initialUser as User,
    enabled: userId ? true : false,
  });
  useEffect(() => {
    userId ? form.setFieldsValue(user.data) : form.resetFields();
  }, [userId, user, form]);

  // typescript
  // 1. What is returned
  // 2. Error
  // 3. what is send
  const addUser = useMutation<User, Error, User>((user) => addUserApi(user));
  const editUser = useMutation<User, Error, User>((user) => editUserApi(userId as string, user));

  // Another way to use mutation
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
      let response: User;
      if (userId) {
        response = await editUser.mutateAsync(values);
        queryClient.invalidateQueries("users");
      } else {
        response = await addUser.mutateAsync(values);
        const previousUsers = queryClient.getQueryData<User[]>("users");
        const newUsers = [response, ...(previousUsers || [])];
        queryClient.setQueryData("users", newUsers);
      }
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout={"vertical"}
        form={form}
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
