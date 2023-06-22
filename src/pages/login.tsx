// import { fetchAvailableOrganizations } from '@/services/organization';
import { useRouter } from 'next/router'
import { toastFail } from '@/utils';
import { useRequest } from 'ahooks';
import 'antd-mobile/bundle/style.css';
// @ts-ignore
import { Button, Form, Input } from 'antd-mobile/bundle/antd-mobile.cjs';
import cookies from 'js-cookie';
import { Fragment, useCallback } from 'react';
import axios from 'axios';
import {SESSION_TOKEN_COOKIE_NAME} from "@/constants";

export default function Login() {
  const router = useRouter()

  const { loading, runAsync: runAsyncLogin } = useRequest(
    (username, password) => axios.post('/api/user/login', {username, password}),
    {
      manual: true,
    },
  );

  const doLogin = useCallback(async (username: string, password: string) => {
    try {
      const loginResponse = await runAsyncLogin(username, password);
      console.log(loginResponse.data.data);
      cookies.set(SESSION_TOKEN_COOKIE_NAME, loginResponse.data.data.jwtToken, { expires: 3 });

      // const availableOrganizationsResult = await fetchAvailableOrganizations();
      // cookies.set(ORGANIZATION_COOKIE_NAME, availableOrganizationsResult[0]._id, { expires: 6 });
      // await caches.delete('wm-runtime-v2');
      router.push('/about')
    } catch (e) {
      toastFail('用户名或密码错误');
      return;
    }
  }, []);

  return (
    <div>
      <img alt="logo" style={{ marginBottom: '2rem' }} width={100} src="/img/logo.svg" />
      <Form
        onFinish={({username, password}: {username: string, password: string}) => {
          doLogin(username, password);
        }}
        footer={
          <Fragment>
            <Button loading={loading} block type="submit" color="primary" size="large">
              登录
            </Button>
            <Button
              block
              size="large"
              onClick={() => {
                router.push('/about')
                // history.push('/register');
              }}
            >
              注册
            </Button>
            <Button
              block
              size="large"
              loading={loading}
              onClick={() => {
                doLogin('访客', 'visitorHash');
              }}
            >
              访客身份登录
            </Button>
          </Fragment>
        }
      >
        <Form.Item name="username" label="邮箱">
          <Input placeholder="请输入登录邮箱" clearable />
        </Form.Item>
        <Form.Item name="password" label="密码">
          <Input placeholder="请输入密码" clearable type="password" />
        </Form.Item>
      </Form>
    </div>
  );
}
