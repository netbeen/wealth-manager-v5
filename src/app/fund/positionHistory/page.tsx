'use client'

import { useRequest } from 'ahooks'
import { useMemo } from 'react'
import { FundTransactionSet } from '@/utils/fundTransacationSet'
import { PositionTable } from '@/components/PositionTable'

export default function Page() {
  // const router = useRouter()
  const { data: transactionSets, loading: transactionSetsLoading } = useRequest(
    async () => {
      const holdingTransactionSets = await fetch(
        `/api/fund/transactionSet?status=CLEARED`
      )
      return (await holdingTransactionSets.json()).data as FundTransactionSet[]
    },
    { refreshDeps: [] }
  )

  return useMemo(
    () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!transactionSetsLoading && (
          <PositionTable
            transactionSets={transactionSets ?? []}
            isCleared={true}
          />
        )}
      </div>
    ),
    [transactionSets]
  )
}
