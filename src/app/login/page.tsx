'use client'

import { useRouter } from 'next/navigation'
import {toastFail, toastSuccess} from '@/utils';
import { useRequest } from 'ahooks';
import 'antd-mobile/bundle/style.css';
// @ts-ignore
import { Button, Form, Input } from 'antd-mobile/bundle/antd-mobile.cjs';
import { Fragment, useCallback } from 'react';
import {HTTP_METHOD} from "@/constants";

export default function Page() {
  const router = useRouter()

  const { loading, runAsync: runAsyncLogin } = useRequest(
    (username, password) => fetch('/api/user/login', {
      method: HTTP_METHOD.POST,
      body: JSON.stringify({
        username,
        password,
      })
    }),
    {
      manual: true,
    },
  );

  const doLogin = useCallback(async (username: string, password: string) => {
      const loginResponse = await runAsyncLogin(username, password);
      if(!loginResponse.ok){
        toastFail('用户名或密码错误');
        return;
      }
      // cookies.set(SESSION_TOKEN_COOKIE_NAME, (await loginResponse.json()).jwtToken, { expires: 3 });

      // const availableOrganizationsResult = await fetchAvailableOrganizations();
      // cookies.set(ORGANIZATION_COOKIE_NAME, availableOrganizationsResult[0]._id, { expires: 6 });
      // await caches.delete('wm-runtime-v2');
      toastSuccess('登录成功');
      await router.push('/about')
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <img alt="logo" style={{ marginBottom: '2rem' }} width={100} src="/img/logo.svg" />
      <Form
        onFinish={({username, password}: {username: string, password: string}) => {
          doLogin(username, password);
        }}
        className="w-full"
        footer={
          <Fragment>
            <Button
                className="mb-1"
                loading={loading} block type="submit" color="primary" size="large">
              登录
            </Button>
            <Button
                className="mb-1"
                block
              size="large"
              onClick={async () => {
                await router.push('/about')
                // history.push('/register');
              }}
            >
              注册
            </Button>
            <Button
                className="mb-1"
                block
              size="large"
              loading={loading}
              onClick={async () => {
                await doLogin('访客', 'visitorHash');
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
