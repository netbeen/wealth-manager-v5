import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // const c = await prisma.user.create({
  //     data: {
  //         name: '394062113@qq.com',
  //         password: ''
  //     }
  // })
  // console.log(c)
  // const users = await prisma.user.findMany()
  // console.log(users);
  // const a = await prisma.team.create({
  //   data: {
  //     name: '访客演示账本',
  //     admins: ['cljec3occ0000mhgfhlq8qu3f'],
  //   },
  // })
  // console.log(a)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
