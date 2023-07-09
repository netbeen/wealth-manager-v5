import { NextResponse } from 'next/server'
import { migrateFailedTransaction } from '@/utils/migrate'

async function handler() {
  await migrateFailedTransaction()
  return NextResponse.json({ data: 'done' })
}

export const POST = handler
