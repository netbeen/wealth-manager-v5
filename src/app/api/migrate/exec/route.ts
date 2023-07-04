import { NextResponse } from 'next/server'
import { migrateFromV4ToV5 } from '@/utils/migrate'

async function handler() {
  await migrateFromV4ToV5()
  return NextResponse.json({ data: 'done' })
}

export const GET = handler
