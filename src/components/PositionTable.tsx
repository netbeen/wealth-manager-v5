import { AntdBaseTable } from '@/components/AntDesignTable'
import { ArtColumn } from 'ali-react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { FundTransactionSet } from '@/utils/fundTransacationSet'
import { COLOR, formatToCurrency, formatToPercentage } from '@/utils/UICommon'
import { BasicInfoUnitPricesDividendsSplitsTransactionsData } from '@/app/api/fund/transactionSet/[transactionSetId]/basicInfoUnitPricesDividendsSplitsTransactions/route'
import dayjs, { Dayjs } from 'dayjs'
import { calcReturn, lastOfArray, sliceBetween } from 'fund-tools'

export const PositionTable: React.FC<{
  transactionSets: FundTransactionSet[]
  isCleared: boolean
}> = ({ transactionSets, isCleared }) => {
  const [fundData, setFundData] = useState<
    BasicInfoUnitPricesDividendsSplitsTransactionsData[]
  >([])

  useEffect(() => {
    Promise.all(
      transactionSets.map((transactionSet) =>
        fetch(
          `/api/fund/transactionSet/${transactionSet.id}/basicInfoUnitPricesDividendsSplitsTransactions`
        )
      )
    ).then(async (res) => {
      const remoteFundData = []
      for (const item of res) {
        // 传输过程中的 Date 和 Dayjs 类型被转换为了 string，需要转回去
        const formattedData: BasicInfoUnitPricesDividendsSplitsTransactionsData =
          (await item.json()).data
        formattedData.unitPrices.data.forEach((unitPrice) => {
          unitPrice.date = dayjs(unitPrice.date)
        })
        formattedData.splits.data.forEach((split) => {
          split.date = dayjs(split.date)
        })
        formattedData.dividends.data.forEach((dividend) => {
          dividend.date = dayjs(dividend.date)
        })
        formattedData.transactions.forEach((transaction) => {
          transaction.date = new Date(transaction.date)
        })

        remoteFundData.push(formattedData)
      }
      setFundData(remoteFundData)
    })
  }, [transactionSets])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const columns: ArtColumn[] = useMemo(() => {
    if (!transactionSets[0]) {
      return []
    }
    return [
      {
        code: 'name',
        name: <span>基金名称</span>,
        width: 150,
        align: 'left',
        render: (value: any, record: any) => (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // history.push(`/fund/transactionSet/${record.transactionSet}`)
            }}
          >
            <div>{`${record.name ?? 'Loading...'} [${record.identifier}]`}</div>
          </div>
        ),
      },
      !isCleared
        ? {
            code: 'positionValue',
            name: <span>市值</span>,
            width: 100,
            align: 'right',
            render: (value: any, record: any) => (
              <div>
                {record.positionValue !== null
                  ? formatToCurrency(record.positionValue)
                  : ''}
              </div>
            ),
          }
        : {
            code: 'positionValue',
            name: (
              <div>
                <div>起投日期</div>
                <div>收益额</div>
              </div>
            ),
            width: 100,
            align: 'right',
            render: (value: any, record: any) => (
              <div>
                <div>
                  {record.startDate !== null
                    ? record.startDate.format('YYYY-MM-DD')
                    : ''}
                </div>
                <div>
                  {record.totalReturn !== null
                    ? formatToCurrency(record.totalReturn)
                    : ''}
                </div>
              </div>
            ),
          },
      {
        code: 'positionRateOfReturn',
        name: (
          <div>
            <div>收益率%</div>
            <div>年化收益率%</div>
          </div>
        ),
        width: 100,
        align: 'right',
        render: (_value: any, record: any) => (
          <div>
            <div
              style={{
                color:
                  record.totalRateOfReturn > 0
                    ? COLOR.Profitable
                    : COLOR.LossMaking,
              }}
            >
              {record.totalRateOfReturn !== null
                ? formatToPercentage(record.totalRateOfReturn)
                : ''}
            </div>
            <div
              style={{
                color:
                  record.totalAnnualizedRateOfReturn > 0
                    ? COLOR.Profitable
                    : COLOR.LossMaking,
              }}
            >
              {record.totalAnnualizedRateOfReturn !== null
                ? formatToPercentage(record.totalAnnualizedRateOfReturn)
                : ''}
            </div>
          </div>
        ),
      },
    ]
  }, [transactionSets])

  const tableData = useMemo(() => {
    return fundData
      .map((fundDataItem) => {
        const rowData: {
          identifier: string
          name?: string
          positionValue: null | number
          totalRateOfReturn: null | number
          totalAnnualizedRateOfReturn: null | number
          transactionSet: string
          totalReturn: number | null
          startDate: Dayjs | null
        } = {
          identifier: fundDataItem.basicInfo.data.identifier,
          name: fundDataItem.basicInfo.data.name,
          positionValue: null,
          totalRateOfReturn: null,
          totalAnnualizedRateOfReturn: null,
          transactionSet: '',
          totalReturn: null,
          startDate: null,
        }
        try {
          const {
            positionValue,
            totalReturn,
            totalRateOfReturn,
            totalAnnualizedRateOfReturn,
          } = calcReturn(
            sliceBetween(
              fundDataItem.unitPrices.data,
              dayjs(fundDataItem.transactions[0].date),
              lastOfArray(fundDataItem.unitPrices.data).date
            ),
            sliceBetween(
              fundDataItem.dividends.data,
              dayjs(fundDataItem.transactions[0].date),
              lastOfArray(fundDataItem.unitPrices.data).date
            ),
            sliceBetween(
              fundDataItem.splits.data,
              dayjs(fundDataItem.transactions[0].date),
              lastOfArray(fundDataItem.unitPrices.data).date
            ),
            sliceBetween(
              fundDataItem.transactions.map((transaction) => ({
                date: dayjs(transaction.date),
                volume: transaction.volume,
                commission: transaction.commission,
                direction: transaction.direction,
              })),
              dayjs(fundDataItem.transactions[0].date),
              lastOfArray(fundDataItem.unitPrices.data).date
            )
          )
          rowData.positionValue = positionValue
          rowData.totalRateOfReturn = totalRateOfReturn
          rowData.totalAnnualizedRateOfReturn = totalAnnualizedRateOfReturn
          rowData.totalReturn = totalReturn
          rowData.startDate = dayjs(fundDataItem.transactions[0].date)
        } catch (e) {
          // TODO: check 博时黄金ETFI [000930]'s error
          console.warn(e)
        }
        return rowData
      })
      .sort((a, b) => {
        if (!isCleared && a.positionValue && b.positionValue) {
          // 按照市值从高到低排序
          return b.positionValue - a.positionValue
        } else if (isCleared && a.startDate && b.startDate) {
          return b.startDate.isBefore(a.startDate) ? -1 : 1
        } else {
          return 1
        }
      })
  }, [fundData])

  return (
    <AntdBaseTable
      dataSource={tableData}
      columns={columns}
      isStickyHeader={false}
      isLoading={fundData.length === 0}
    />
  )
}
