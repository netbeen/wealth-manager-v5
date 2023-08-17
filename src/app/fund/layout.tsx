'use client'

import { Tabs } from 'antd-mobile'
import { usePathname, useRouter } from 'next/navigation'
import { fundSecondaryTabData } from '@/utils/UICommon'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const currentActiveKey = fundSecondaryTabData.find(
    (item) => item.url === pathname
  )?.value

  if (!currentActiveKey) {
    return children
  }
  return (
    <Tabs
      // className={layoutStyles.mainContentTab}
      onChange={(key) => {
        router.push(
          fundSecondaryTabData.find((item) => item.value === key)?.url ?? ''
        )
      }}
      defaultActiveKey={currentActiveKey ?? ''}
    >
      {fundSecondaryTabData.map((item) => (
        <Tabs.Tab title={item.label} key={item.value}>
          {children}
        </Tabs.Tab>
      ))}
    </Tabs>
  )
}
