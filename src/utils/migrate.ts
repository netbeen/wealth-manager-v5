import transactionSets0704 from './transactionSets0704.json'
import transactions0704 from './transactions0704.json'
import {
  createFundTransaction,
  FundTransactionDirection,
} from '@/utils/fundTransacation'
import { getTeamById } from '@/utils/team'

// const yyV4UserId = '6193a7146865251545a99dfe'
const yyV4TeamId = '6194bc94ab58576b069d0c91'
const yyV5TeamId = 'cljf7h3dw0000mhyertfws9j2'

// const currentV4TransactionSetId: string | null = null

export const migrateFromV4ToV5 = async () => {
  const team = await getTeamById(yyV5TeamId)

  const sortedTransactions = transactions0704.sort((a, b) => {
    // 根据交易单时间排序
    return new Date(a.date).valueOf() - new Date(b.date).valueOf()
  })

  for (const [index, v4Transaction] of sortedTransactions.entries()) {
    // 遍历交易单
    const v4TransactionSet = transactionSets0704.find(
      (item) => item._id.$oid === v4Transaction.transactionSet
    )
    if (!v4TransactionSet) {
      throw new Error(
        `v4TransactionSet id=${v4Transaction.transactionSet} 未找到`
      )
    }
    if (v4TransactionSet && v4TransactionSet.organization !== yyV4TeamId) {
      // 忽略非yy团队的交易单
      continue
    }
    console.log(
      `=== [${index}/${sortedTransactions.length}] Going to handle transaction:`,
      v4Transaction
    )

    await createFundTransaction({
      fundId: v4TransactionSet.target,
      team,
      date: new Date(v4Transaction.date),
      direction:
        v4Transaction.direction === 'BUY'
          ? FundTransactionDirection.BUY
          : FundTransactionDirection.SELL,
      volume: v4Transaction.volume,
      commission: v4Transaction.commission,
    })

    console.log('Successfully migrated:', v4Transaction._id.$oid)
  }
}

export const migrateFailedTransaction = async () => {
  const v4TransactionId = '61ab240eb2ec67e10aa427c4'
  const team = await getTeamById(yyV5TeamId)
  const v4Transaction = transactions0704.find(
    (item) => item._id.$oid === v4TransactionId
  )
  if (!v4Transaction) {
    throw new Error()
  }
  const v4TransactionSet = transactionSets0704.find(
    (item) => item._id.$oid === v4Transaction.transactionSet
  )
  if (!v4TransactionSet) {
    throw new Error()
  }
  await createFundTransaction({
    fundId: v4TransactionSet.target,
    team,
    date: new Date(v4Transaction.date),
    direction:
      v4Transaction.direction === 'BUY'
        ? FundTransactionDirection.BUY
        : FundTransactionDirection.SELL,
    volume: v4Transaction.volume,
    commission: v4Transaction.commission,
  })
}
