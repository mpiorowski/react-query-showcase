import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { User } from "./UsersList";
import { addUserApi, editUserApi, getUserApi } from "./usersApi";
import { getUser } from "./userSlice";

type Props = {
  users?: User[];
};

export const UserForm = ({ users }: Props) => {
  const queryClient = useQueryClient();
  const initialUser = useSelector(getUser);
  const userId = initialUser?.id || null;
  const [form] = Form.useForm();

  /**
   * Set initial data for user edit, then make an api call to check for correct data.
   * If no user selected, reset form
   * typescript <1,2>:
   * 1. What is returned
   * 2. Error
   */
  const user = useQuery<User, Error>(["user", userId], () => getUserApi(userId as string), {
    initialData: initialUser as User,
    enabled: userId ? true : false,
  });
  useEffect(() => {
    userId ? form.setFieldsValue(user.data) : form.resetFields();
  }, [userId, user, form]);

  // typescript <1,2,3>:
  // 1. What is returned
  // 2. Error
  // 3. what is send
  const addUser = useMutation<User, Error, User>((user) => addUserApi(user));
  const editUser = useMutation<User, Error, { userId: string; user: User }>(({ userId, user }) =>
    editUserApi(userId, user)
  );

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
        // addUser.mutate({ userId: userId, user: values })
        await editUser.mutateAsync({ userId: userId, user: values });
        queryClient.invalidateQueries("users");
        queryClient.invalidateQueries(["user", userId]);
      } else {
        response = await addUser.mutateAsync(values);
        queryClient.setQueryData(["user", userId], response);
        
        const previousUsers = users;
        // const previousUsers = queryClient.getQueryData<User[]>("users");
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
