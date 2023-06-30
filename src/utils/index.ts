// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Toast } from 'antd-mobile/bundle/antd-mobile.cjs'

export const toastFail = (content: string) => {
  Toast.show({
    icon: 'fail',
    content,
  })
}

export const toastSuccess = (content: string) => {
  Toast.show({
    icon: 'success',
    content,
  })
}
