'use client'

import { useRequest } from 'ahooks'
import { useMemo } from 'react'
import { FundTransactionSet } from '@/utils/fundTransacationSet'
import { PositionTable } from '@/components/PositionTable'
import { AddTransactionButton } from '@/components/AddTransactionButton'

export default function Page() {
  // const router = useRouter()
  const { data: transactionSets, loading: transactionSetsLoading } = useRequest(
    async () => {
      const holdingTransactionSets = await fetch(
        `/api/fund/transactionSet?status=HOLDING`
      )
      return (await holdingTransactionSets.json()).data as FundTransactionSet[]
    },
    { refreshDeps: [] }
  )

  return useMemo(
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
}
