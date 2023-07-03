'use client'

import { useRouter } from 'next/navigation'
import { toastFail, toastSuccess } from '@/utils/UICommon'
import { useRequest } from 'ahooks'
import 'antd-mobile/bundle/style.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Form, Input } from 'antd-mobile/bundle/antd-mobile.cjs'
import { Fragment, useCallback, useEffect } from 'react'
import { HTTP_METHOD, PAGE_AFTER_LOGIN } from '@/constants'

export default function Page() {
  const router = useRouter()

  const { loading: meLoading, data: meData } = useRequest(() =>
    fetch('/api/user/me')
  )
  useEffect(() => {
    if (!meLoading && meData?.ok) {
      toastSuccess('Session有效，无需重新登录')
      router.push(PAGE_AFTER_LOGIN)
    }
  }, [meLoading, meData])

  const { loading, runAsync: runAsyncLogin } = useRequest(
    (username, password) =>
      fetch('/api/user/login', {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          username,
          password,
        }),
      }),
    {
      manual: true,
    }
  )

  const doLogin = useCallback(async (username: string, password: string) => {
    const loginResponse = await runAsyncLogin(username, password)
    if (!loginResponse.ok) {
      toastFail('用户名或密码错误')
      return
    }
    toastSuccess('登录成功')
    await router.push(PAGE_AFTER_LOGIN)
  }, [])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <img
        alt="logo"
        style={{ marginBottom: '2rem' }}
        width={100}
        src="/img/logo.svg"
      />
      <Form
        onFinish={({
          username,
          password,
        }: {
          username: string
          password: string
        }) => {
          doLogin(username, password)
        }}
        className="w-full"
        footer={
          <Fragment>
            <Button
              className="mb-1"
              loading={loading || meLoading}
              block
              type="submit"
              color="primary"
              size="large"
            >
              登录
            </Button>
            <Button
              loading={meLoading}
              className="mb-1"
              block
              size="large"
              onClick={async () => {
                // await router.push('/about')
                // history.push('/register');
              }}
            >
              注册
            </Button>
            <Button
              className="mb-1"
              block
              size="large"
              loading={loading || meLoading}
              onClick={async () => {
                await doLogin('访客', 'visitorHash')
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
  )
}
