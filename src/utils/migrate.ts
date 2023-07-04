import transactionsets0704 from './transactionsets0704.json'
import transactions0704 from './transactions0704.json'
import {
  createFundTransaction,
  FundTransactionDirection,
} from '@/utils/fundTransacation'
import { getTeamById } from '@/utils/team'

const yyV4UserId = '6193a7146865251545a99dfe'
const yyV4TeamId = '6194bc94ab58576b069d0c91'
const yyV5TeamId = 'cljf7h3dw0000mhyertfws9j2'

const currentV4TransactionSetId: string | null = null

export const migrateFromV4ToV5 = async () => {
  const team = await getTeamById(yyV5TeamId)

  const sortedTransactions = transactions0704.sort((a, b) => {
    // 根据交易单时间排序
    return new Date(a.date).valueOf() - new Date(b.date).valueOf()
  })

  for (const v4Transaction of sortedTransactions) {
    // 遍历交易单
    const v4TransactionSet = transactionsets0704.find(
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
    // if (
    //   currentV4TransactionSetId !== null &&
    //   currentV4TransactionSetId !== v4TransactionSet._id.$oid
    // ) {
    //   continue
    // }
    // currentV4TransactionSetId = v4TransactionSet._id.$oid
    console.log(v4Transaction)

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
}
