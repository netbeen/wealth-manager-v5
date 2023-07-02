// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Toast } from 'antd-mobile/bundle/antd-mobile.cjs'
import { Dayjs } from 'dayjs'

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

export const formatToCurrency = (value: number, fractionDigits = 2) =>
  Intl.NumberFormat('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)

export const formatToPercentage = (value: number) =>
  `${formatToCurrency(value * 100)}%`

export enum COLOR {
  Profitable = '#d20',
  LossMaking = '#093',
}

export const fundSecondaryTabData = [
  {
    value: 'metrics',
    label: '概览',
    url: '/fund/metrics',
  },
  {
    value: 'position',
    label: '当前持仓',
    url: '/fund/position',
  },
  {
    value: 'positionHistory',
    label: '历史持仓',
    url: '/fund/positionHistory',
  },
  {
    value: 'transactionList',
    label: '交易记录',
    url: '/fund/transactionList',
  },
]

export interface FundBasicInfoType {
  identifier: string
  name: string
  type: string
}
export interface FundPriceType {
  date: Dayjs
  price: number
}
export interface FundDividendType {
  date: Dayjs
  dividend: number
}
export interface FundSpitType {
  date: Dayjs
  splitRatio: number
}
