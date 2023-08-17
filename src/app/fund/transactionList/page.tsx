'use client'

import { AntdBaseTable } from '@/components/AntDesignTable'
import { COLOR, formatToCurrency } from '@/utils/UICommon'
import { useAsyncEffect, useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { FundTransactionSet } from '@/utils/fundTransacationSet'
import { BasicInfoUnitPricesDividendsSplitsTransactionsData } from '@/app/api/fund/transactionSet/[transactionSetId]/basicInfoUnitPricesDividendsSplitsTransactions/route'
import dayjs from 'dayjs'

export default function Page() {
  const { data: transactionSets, loading: transactionSetsLoading } = useRequest(
    async () => {
      const holdingTransactionSets = await fetch(`/api/fund/transactionSet`)
      return (await holdingTransactionSets.json()).data as FundTransactionSet[]
    },
    { refreshDeps: [] }
  )

  const [fundData, setFundData] = useState<
    BasicInfoUnitPricesDividendsSplitsTransactionsData[]
  >([])

  const allTransactions = useMemo(() => {
    if (fundData.length === 0) {
      return []
    }
    return fundData
      .map((fundDataItem) => fundDataItem.transactions)
      .flat(1)
      .sort((a, b) => a.date.valueOf() - b.date.valueOf())
  }, [fundData])
  console.log('allTransactions', allTransactions)

  useAsyncEffect(async () => {
    if (transactionSets) {
      const data = await fetch(
        `/api/fund/transactionSet/batch/basicInfoUnitPricesDividendsSplitsTransactions?transactionSetIds=${transactionSets
          .map((item) => item.id)
          .join(',')}`
      )
      const formattedData: BasicInfoUnitPricesDividendsSplitsTransactionsData[] =
        (await data.json()).data
      for (const formattedDataItem of formattedData) {
        // 传输过程中的 Date 和 Dayjs 类型被转换为了 string，需要转回去
        formattedDataItem.unitPrices.data.forEach((unitPrice) => {
          unitPrice.date = dayjs(unitPrice.date)
        })
        formattedDataItem.splits.data.forEach((split) => {
          split.date = dayjs(split.date)
        })
        formattedDataItem.dividends.data.forEach((dividend) => {
          dividend.date = dayjs(dividend.date)
        })
        formattedDataItem.transactions.forEach((transaction) => {
          transaction.date = new Date(transaction.date)
        })
      }
      console.log('formattedData', formattedData)
      setFundData(formattedData)
    }
    // transactionSets &&
    //   Promise.all(
    //     transactionSets.map((transactionSet) =>
    //       fetch(
    //         `/api/fund/transactionSet/${transactionSet.id}/basicInfoUnitPricesDividendsSplitsTransactions`
    //       )
    //     )
    //   ).then(
    //     async (
    //       basicInfoUnitPricesDividendsSplitsTransactionsOfTransactionSets
    //     ) => {
    //       const remoteFundData = []
    //       for (const basicInfoUnitPricesDividendsSplitsTransactionsOfTransactionSet of basicInfoUnitPricesDividendsSplitsTransactionsOfTransactionSets) {
    //         // 传输过程中的 Date 和 Dayjs 类型被转换为了 string，需要转回去
    //         const formattedData: BasicInfoUnitPricesDividendsSplitsTransactionsData =
    //           (
    //             await basicInfoUnitPricesDividendsSplitsTransactionsOfTransactionSet.json()
    //           ).data
    //         formattedData.unitPrices.data.forEach((unitPrice) => {
    //           unitPrice.date = dayjs(unitPrice.date)
    //         })
    //         formattedData.splits.data.forEach((split) => {
    //           split.date = dayjs(split.date)
    //         })
    //         formattedData.dividends.data.forEach((dividend) => {
    //           dividend.date = dayjs(dividend.date)
    //         })
    //         formattedData.transactions.forEach((transaction) => {
    //           transaction.date = new Date(transaction.date)
    //         })
    //
    //         remoteFundData.push(formattedData)
    //       }
    //       setFundData(remoteFundData)
    //     }
    //   )
  }, [transactionSets])

  return useMemo(() => {
    if (!transactionSets) {
      return null
    }
    const tableDataSource = allTransactions
      .map((transaction) => {
        const targetTransactionSet = transactionSets.find(
          (transactionSet) =>
            transactionSet.id === transaction.fundTransactionSetId
        )
        if (!targetTransactionSet) {
          throw new Error(
            `cannot find targetTransactionSet, transaction=${JSON.stringify(
              transaction
            )}`
          )
        }

        const targetFundData = fundData.find(
          (item) =>
            item.basicInfo.data.identifier === targetTransactionSet.fundId
        )

        if (!targetFundData) {
          throw new Error('!targetFundData')
        }
        const targetBasicInfo = targetFundData.basicInfo.data
        const targetUnitPrices = targetFundData.unitPrices.data
        const targetUnitPrice =
          targetUnitPrices.find((item) => item.date.isSame(transaction.date))
            ?.price ?? 0

        return {
          name: targetBasicInfo?.name,
          date: dayjs(transaction.date).format('YYYY-MM-DD'),
          direction: transaction.direction,
          transactionValue:
            Math.round(
              (targetUnitPrice * transaction.volume + transaction.commission) *
                10
            ) / 10,
        }
      })
      .filter((item) => item)

    console.log('tableDataSource', tableDataSource)
    return (
      <div>
        <AntdBaseTable
          dataSource={tableDataSource}
          columns={[
            {
              code: 'name',
              name: '基金名称',
              width: 150,
              align: 'left',
            },
            {
              code: 'date',
              name: '交易日期',
              width: 100,
              align: 'right',
            },
            {
              code: 'date',
              // name: (
              //   <div>
              //     <div>交易方向</div>
              //     <div>交易金额</div>
              //   </div>
              // ),
              name: '交易方向/交易金额',
              width: 100,
              align: 'right',
              render: (_value, record) => (
                <div>
                  <div
                    style={{
                      color:
                        record.direction === 'BUY'
                          ? COLOR.LossMaking
                          : COLOR.Profitable,
                    }}
                  >
                    {record.direction === 'BUY' ? '买入' : '卖出'}
                  </div>
                  <div>{formatToCurrency(record.transactionValue)}</div>
                </div>
              ),
            },
          ]}
          isStickyHeader={false}
          isLoading={transactionSetsLoading}
        />
      </div>
    )
  }, [allTransactions])
}
