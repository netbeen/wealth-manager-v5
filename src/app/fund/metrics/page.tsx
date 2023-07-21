'use client'

import { useAsyncEffect, useRequest } from 'ahooks'
import { Loading } from 'antd-mobile'
import {
  Axis,
  Chart,
  Coordinate,
  Interaction,
  Interval,
  Line,
  Tooltip,
} from 'bizcharts'
import dayjs, { Dayjs } from 'dayjs'
import { calcReturn, sliceBetween } from 'fund-tools'
import { useMemo, useState } from 'react'
import { COLOR, formatToCurrency, formatToPercentage } from '@/utils/UICommon'
import { Overview } from '@/components/Overview'
import { FundTransactionSet } from '@/utils/fundTransacationSet'
import { BasicInfoUnitPricesDividendsSplitsTransactionsData } from '@/app/api/fund/transactionSet/[transactionSetId]/basicInfoUnitPricesDividendsSplitsTransactions/route'

const restChartProps = {
  interactions: ['tooltip', 'element-active'],
  animate: false,
  padding: [10, 10, 60, 40],
  autoFit: true,
}

export default function Page() {
  const [fundData, setFundData] = useState<
    BasicInfoUnitPricesDividendsSplitsTransactionsData[]
  >([])

  const { data: transactionSets } = useRequest(
    async () => {
      const holdingTransactionSets = await fetch(
        `/api/fund/transactionSet?status=HOLDING`
      )
      return (await holdingTransactionSets.json()).data as FundTransactionSet[]
    },
    { refreshDeps: [] }
  )

  useAsyncEffect(async () => {
    if (!Array.isArray(transactionSets) || transactionSets.length === 0) {
      return
    }
    const basicInfoUnitPricesDividendsSplitsTransactions = await Promise.all(
      transactionSets.map((transactionSet) =>
        fetch(
          `/api/fund/transactionSet/${transactionSet.id}/basicInfoUnitPricesDividendsSplitsTransactions`
        )
      )
    )
    const remoteFundData = []
    for (const item of basicInfoUnitPricesDividendsSplitsTransactions) {
      // 传输过程中的 Date 和 Dayjs 类型被转换为了 string，需要转回去
      const formattedData: BasicInfoUnitPricesDividendsSplitsTransactionsData =
        (await item.json()).data
      formattedData.unitPrices.data.forEach((unitPrice) => {
        unitPrice.date = dayjs(unitPrice.date)
      })
      formattedData.splits.data.forEach((split) => {
        split.date = dayjs(split.date)
      })
      formattedData.dividends.data.forEach((divident) => {
        divident.date = dayjs(divident.date)
      })
      formattedData.transactions.forEach((transaction) => {
        transaction.date = new Date(transaction.date)
      })

      remoteFundData.push(formattedData)
    }
    setFundData(remoteFundData)
  }, [transactionSets])

  const tableData = useMemo(() => {
    if (!Array.isArray(transactionSets) || fundData.length === 0) {
      return []
    }
    return transactionSets
      .map((transactionSet, index) => {
        const rowData: {
          identifier: string
          name?: string
          positionValue: null | number
          totalRateOfReturn: null | number
          totalReturn: number | null
          startDate: Dayjs | null
        } = {
          identifier: transactionSet.fundId,
          name: fundData[index].basicInfo.data.name,
          positionValue: null,
          totalRateOfReturn: null,
          totalReturn: null,
          startDate: null,
        }
        const { positionValue, totalReturn, totalRateOfReturn } = calcReturn(
          sliceBetween(
            fundData[index].unitPrices.data,
            dayjs(fundData[index].transactions[0].date),
            dayjs()
          ),
          [],
          [],
          fundData[index].transactions.map((item) => ({
            ...item,
            date: dayjs(item.date),
          }))
        )
        rowData.positionValue = positionValue
        rowData.totalRateOfReturn = totalRateOfReturn
        rowData.totalReturn = totalReturn
        rowData.startDate = dayjs(fundData[index].transactions[0].date)
        return rowData
      })
      .sort((a, b) => {
        if (a.positionValue && b.positionValue) {
          // 按照市值从高到低排序
          return b.positionValue - a.positionValue
        } else {
          return 1
        }
      })
  }, [fundData, transactionSets])

  const { chartData, overviewData } = useMemo(() => {
    if (!tableData[0] || typeof tableData[0].positionValue !== 'number') {
      return {
        chartData: [],
      }
    }
    const totalValue = tableData.reduce(
      (pre, cur) => pre + (cur?.positionValue ?? 0),
      0
    )
    const totalReturn = tableData.reduce(
      (pre, cur) => pre + (cur?.totalReturn ?? 0),
      0
    )

    return {
      chartData: tableData.map((item) => ({
        name: item.name,
        percentage: (item.positionValue ?? 0) / totalValue,
      })),
      overviewData: {
        totalValue,
        totalReturn,
      },
    }
  }, [tableData])

  const overviewContent = useMemo(() => {
    if (!overviewData || !transactionSets || !Array.isArray(transactionSets)) {
      return null
    }
    return (
      <Overview
        backgroundColor={
          overviewData.totalReturn > 0 ? COLOR.Profitable : COLOR.LossMaking
        }
        data={[
          ['总市值', formatToCurrency(overviewData.totalValue)],
          ['持仓品种', transactionSets.length.toString()],
          ['持仓收益', formatToCurrency(overviewData.totalReturn)],
          [
            '持仓收益率',
            formatToPercentage(
              overviewData.totalReturn /
                (overviewData.totalValue - overviewData.totalReturn)
            ),
          ],
        ]}
      />
    )
  }, [overviewData])

  const cols = {
    percentage: {
      formatter: (val: number) => formatToPercentage(val),
    },
  }

  const mainContent = useMemo(() => {
    if (chartData.length === 0) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Loading />
        </div>
      )
    }
    const profitHistoryChart = (
      <Chart
        height={250}
        data={[]}
        scale={{
          date: {
            type: 'time',
          },
          value: {
            type: 'linear',
            formatter: (v: string) => formatToCurrency(Number(v)),
          },
          type: {
            formatter: (v: string) => {
              return {
                totalAssets: '总资产',
                netAssets: '净资产',
              }[v]
            },
          },
        }}
        {...restChartProps}
      >
        <Tooltip shared showCrosshairs showMarkers linkage="someKey" />
        <Axis name="date" />
        <Axis
          name="value"
          label={{
            formatter(text) {
              return `${Number(text.replace(/,/g, '')) / 10000}W`
            },
          }}
        />
        <Line shape="smooth" position="date*value" color="type" />
      </Chart>
    )
    const distributionChart = (
      <Chart animate={false} height={300} data={chartData} scale={cols} autoFit>
        <Coordinate type="theta" radius={0.75} />
        <Tooltip showTitle={false} />
        <Axis visible={false} />
        <Interval
          position="percentage"
          adjust="stack"
          color="name"
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
          label={[
            'percentage',
            {
              // label 太长自动截断
              layout: { type: 'limit-in-plot', cfg: { action: 'ellipsis' } },
              content: (data) =>
                `${data.name}: ${formatToPercentage(data.percentage)}`,
            },
          ]}
        />
        <Interaction type="element-single-selected" />
      </Chart>
    )
    return (
      <>
        {distributionChart}
        {profitHistoryChart}
      </>
    )
  }, [chartData])

  return (
    <div>
      {overviewContent}
      {mainContent}
    </div>
  )
}
