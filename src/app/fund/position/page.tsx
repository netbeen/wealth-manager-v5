'use client'

import { useRequest } from 'ahooks'
import { Tabs } from 'antd-mobile'
import { Fragment, useMemo } from 'react'
import { FundTransactionSet } from '@/utils/fundTransacationSet'
import { fundSecondaryTabData } from '@/utils/UICommon'
import { useRouter } from 'next/navigation'
import { PositionTable } from '@/components/PositionTable'

const TabPane = Tabs.Tab

export default function Page() {
  const router = useRouter()
  const { data: transactionSets, loading: transactionSetsLoading } = useRequest(
    async () => {
      const holdingTransactionSets = await fetch('/api/fund/transactionSet')
      return (await holdingTransactionSets.json()).data as FundTransactionSet[]
    },
    { refreshDeps: [] }
  )

  console.log('transactionSets', transactionSets)
  const mainContent = useMemo(
    () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/*<AddTransactionButton />*/}
        {!transactionSetsLoading && (
          <PositionTable transactionSets={transactionSets ?? []} />
        )}
      </div>
    ),
    [transactionSets]
  )

  return (
    <Fragment>
      <Tabs
        // className={layoutStyles.mainContentTab}
        onChange={(key) => {
          router.push(
            fundSecondaryTabData.find((item) => item.value === key)?.url ?? ''
          )
        }}
        activeKey={'position'}
      >
        <div>123</div>
        {fundSecondaryTabData.map((item) => (
          <TabPane title={item.label} key={item.value}>
            {item.value === 'position' ? mainContent : <div />}
          </TabPane>
        ))}
      </Tabs>
    </Fragment>
  )
}
