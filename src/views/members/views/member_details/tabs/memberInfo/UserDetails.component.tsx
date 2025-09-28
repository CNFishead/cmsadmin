'use client';
import React from 'react';
import styles from './index.module.scss';
import { Form, Switch, Input, Divider, Select, FloatButton } from 'antd';
import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import formStyles from '@/styles/Form.module.scss';
import { BsFillPhoneFill, BsMailbox } from 'react-icons/bs';
import { MdOutlineMail } from 'react-icons/md';
import { useUser } from '@/state/auth';
import checkRoles from '@/utils/checkRoles';
import { useParams } from 'next/navigation';
import useApiHook from '@/state/useApi';
import Loader from '@/components/loader/Loader.component';
import Error from '@/components/error/Error.component';
import FloatButtonGroup from 'antd/es/float-button/FloatButtonGroup';

const UserDetails = () => {
  const { id } = useParams();
  const { data: loggedInUser } = useUser();
  const [form] = Form.useForm();

  // fetch the user data from the server
  const { data, isLoading, isError, error } = useApiHook({
    url: `/admin/user/${id}`,
    method: 'GET',
    enabled: !!id,
    key: ['users', `${id}`],
  }) as any;
  const { mutate: updateUser } = useApiHook({
    method: 'PUT',
    key: ['user-update', `${id}`],
    queriesToInvalidate: ['users'],
    successMessage: `User updated successfully`,
  }) as any;

  React.useEffect(() => {
    if (data?.payload) {
      form.setFieldsValue({
        ...data.payload,
        initialPayment: data.payload.initialPayment?.split('T')[0],
        nextPayment: data.payload.nextPayment?.split('T')[0],
      });
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <Error error={error.message} />;
  }
  return (
    <Form layout="vertical" form={form} className={`${formStyles.form} ${styles.container}`}>
      <div className={styles.leftContainer}>
        <div className={formStyles.editContainer}>
          <h1 className={formStyles.header}>Basic info</h1>

          <div className={formStyles.group}>
            <Form.Item label="First Name" name="firstName">
              <Input
                prefix={<UserOutlined />}
                placeholder="First Name"
                className={formStyles.input}
              />
            </Form.Item>

            <Form.Item label="Last Name" name="lastName">
              <Input
                prefix={<UserOutlined />}
                placeholder="Last Name"
                className={formStyles.input}
              />
            </Form.Item>
          </div>

          <div className={formStyles.group}>
            <Form.Item label="Email" name="email">
              <Input prefix={<MdOutlineMail />} placeholder="Email" className={formStyles.input} />
            </Form.Item>

            <Form.Item label="Phone" name="phoneNumber">
              <Input
                prefix={<BsFillPhoneFill />}
                placeholder="Phone"
                className={formStyles.input}
                addonAfter={
                  // add a button to click that will call the user
                  // <a disabled={checkRoles(loggedInUser.user.role, ['admin', 'superAdmin'])})} href={`tel:+1phoneNumber`}>
                  //   <PhoneOutlined />
                  // </a>
                  <></>
                }
              />
            </Form.Item>
            <Form.Item label="Username" name="username">
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                className={formStyles.input}
              />
            </Form.Item>
          </div>
          <div className={formStyles.group}>
            <Form.Item label="Roles" name="role" help="">
              <Select
                prefix={<UserOutlined />}
                placeholder="Roles"
                className={formStyles.input}
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                options={[
                  { label: 'Admin', value: 'admin' },
                  { label: 'Super Admin', value: 'superAdmin' },
                  { label: 'User', value: 'user' },
                  { label: 'Developer', value: 'developer' },
                  { label: 'Support', value: 'agent' },
                ]}
              />
            </Form.Item>
          </div>
          <Divider />
          <h1 className={formStyles.header}>Options</h1>
          <div className={formStyles.group}>
            <Form.Item label="Is Paid User" name="isPaidUser" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="Email Verified" name="isEmailVerified" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={formStyles.editContainer}>
          <h1 className={formStyles.header}>Payment Details</h1>

          <Form.Item label="Credits" name="credits">
            <Input
              prefix={<UserOutlined />}
              placeholder="Credits"
              type="number"
              className={formStyles.input}
            />
          </Form.Item>

          <div className={formStyles.group}>
            <Form.Item label="Initial Payment" name="initialPayment">
              <Input
                prefix={<UserOutlined />}
                placeholder="Initial Payment"
                className={formStyles.input}
                type="date"
                disabled={checkRoles(loggedInUser.role, ['admin', 'superAdmin'])}
              />
            </Form.Item>

            <Form.Item label="Next Payment" name="nextPayment">
              <Input
                prefix={<UserOutlined />}
                placeholder="Next Payment"
                className={formStyles.input}
                type="date"
                disabled={checkRoles(loggedInUser.role, ['admin', 'superAdmin'])}
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <FloatButtonGroup>
        <FloatButton
          onClick={() => updateUser({ url: `/admin/user/${id}`, formData: form.getFieldsValue() })}
          tooltip="Update User"
        />
      </FloatButtonGroup>
    </Form>
  );
};

export default UserDetails;
