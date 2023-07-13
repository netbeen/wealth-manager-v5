'use client'

import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import {
  CheckShieldOutline,
  PayCircleOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { TabBar } from 'antd-mobile'
import { usePathname, useRouter } from 'next/navigation'

const tabs = [
  {
    key: 'wealth',
    title: '财富',
    url: '/wealth/metrics',
    icon: <PayCircleOutline />,
  },
  {
    key: 'fund',
    title: '基金',
    url: '/fund/metrics',
    icon: <UnorderedListOutline />,
  },
  {
    key: 'insurance',
    title: '保险',
    url: '/insurance/list',
    icon: <CheckShieldOutline />,
  },
  {
    key: 'me',
    title: '个人中心',
    url: '/me',
    icon: <UserOutline />,
  },
]

const pathWithoutLayout = ['/login', '/register', '/fund/transactionDesktop']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathWithoutLayout.includes(pathname))
    return (
      <html>
        <body className={inter.className}>{children}</body>
      </html>
    )

  return (
    <html>
      <body className={inter.className}>
        <div className="h-full w-full">
          <div className="h-[calc(100vh-49px)] overflow-y-auto">{children}</div>
          <TabBar
            className=""
            activeKey={
              tabs.find((item) => pathname.includes(item.key))?.key ?? ''
            }
            onChange={(selectedKey) => {
              router.push(
                tabs.find((item) => item.key === selectedKey)?.url ?? ''
              )
            }}
          >
            {tabs.map((item) => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
          </TabBar>
        </div>
      </body>
    </html>
  )
}
