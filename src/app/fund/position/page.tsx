'use client'

import { useRequest } from 'ahooks'
import { useMemo } from 'react'
import { FundTransactionSet } from '@/utils/fundTransacationSet'
// import { useRouter } from 'next/navigation'
import { PositionTable } from '@/components/PositionTable'
import { AddTransactionButton } from '@/components/AddTransactionButton'

export default function Page() {
  // const router = useRouter()
  const { data: transactionSets, loading: transactionSetsLoading } = useRequest(
    async () => {
      const holdingTransactionSets = await fetch('/api/fund/transactionSet')
      return (await holdingTransactionSets.json()).data as FundTransactionSet[]
    },
    { refreshDeps: [] }
  )

  const mainContent = useMemo(
    () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AddTransactionButton />
        {!transactionSetsLoading && (
          <PositionTable transactionSets={transactionSets ?? []} />
        )}
      </div>
    ),
    [transactionSets]
  )

  return mainContent
}
