'use client'

export default function Page({
  params,
}: {
  params: { transactionSetId: string }
}) {
  const { transactionSetId } = params
  console.log('transactionSetId', transactionSetId)

  return 'Hello'
}
