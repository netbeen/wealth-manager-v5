'use client'

import { useRequest } from 'ahooks'
import { Button, List, NavBar, Picker } from 'antd-mobile'
import { HTTP_METHOD, LOGIN_PAGE_PATH } from '@/constants'
import { useRouter } from 'next/navigation'
import { User } from '@/utils/user'
import { Team } from '@/utils/team'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()

  const { data: user } = useRequest(async () => {
    const meData = await fetch('/api/user/me')
    return (await meData.json()) as User
  })

  const { data: team } = useRequest(async () => {
    const meData = await fetch('/api/team/current')
    return (await meData.json()) as Team
  })

  const { data: availableTeams } = useRequest(async () => {
    const meData = await fetch('/api/team')
    return (await meData.json()) as Team[]
  })
  console.log('availableTeams', availableTeams)

  const [teamPickerVisible, setTeamPickerVisible] = useState<boolean>(false)

  return (
    <div>
      <NavBar backArrow={false}>个人中心</NavBar>
      <List>
        <List.Item
          key={user?.name ?? ''}
          description={user?.name ?? 'Loading...'}
        >
          当前用户
        </List.Item>
        <List.Item
          description={team?.name ?? 'Loading...'}
          clickable
          onClick={() => {
            setTeamPickerVisible(true)
          }}
        >
          当前账本
        </List.Item>
        <List.Item
          clickable
          onClick={() => {
            // history.push('/health-check')
          }}
        >
          系统健康检查
        </List.Item>
        {user?.name == '394062113@qq.com' && (
          <List.Item
            clickable
            onClick={() => {
              // history.push('/yy-quarter-wealth-manager')
            }}
          >
            季度财务盘点
          </List.Item>
        )}
        <List.Item>
          <Button
            block
            color="danger"
            size="large"
            onClick={async () => {
              const logoutRes = await fetch('/api/user/logout', {
                method: HTTP_METHOD.POST,
              })
              console.log('logoutRes', logoutRes)
              await router.push(LOGIN_PAGE_PATH)
            }}
          >
            退出登录
          </Button>
        </List.Item>
      </List>
      <Picker
        columns={[availableTeams?.map((item) => item.name) ?? []]}
        visible={teamPickerVisible}
        onClose={() => {
          setTeamPickerVisible(false)
        }}
        onConfirm={async (pickedNames, d) => {
          if (!pickedNames || !pickedNames[0]) {
            return
          }
          const targetTeam = availableTeams?.find(
            (item) => item.name === pickedNames[0]
          )
          await fetch('/api/team/switch', {
            method: HTTP_METHOD.POST,
            body: JSON.stringify({
              teamId: targetTeam?.id ?? '',
            }),
          })
          //   await caches.delete('wm-runtime-v2')
          //   window.location.href = '/'
        }}
      />
    </div>
  )
}
