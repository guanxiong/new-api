/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/status-badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatQuota } from '@/lib/format'
import { cn } from '@/lib/utils'

type UserQuotaCellProps = {
  used: number
  remaining: number
  subscriptionCount: number
  subscriptionTotal: number
  subscriptionUsed: number
  subscriptionRemaining: number
  subscriptionUnlimited: boolean
}

function getQuotaProgressColor(percentage: number): string {
  if (percentage <= 10) return '[&_[data-slot=progress-indicator]]:bg-rose-500'
  if (percentage <= 30) return '[&_[data-slot=progress-indicator]]:bg-amber-500'
  return '[&_[data-slot=progress-indicator]]:bg-emerald-500'
}

export function UserQuotaCell(props: UserQuotaCellProps) {
  const { t } = useTranslation()
  const walletTotal = props.used + props.remaining
  const walletPercentage =
    walletTotal > 0 ? (props.remaining / walletTotal) * 100 : 0
  const subscriptionPercentage =
    props.subscriptionTotal > 0
      ? (props.subscriptionRemaining / props.subscriptionTotal) * 100
      : 0

  const walletRemaining = formatQuota(props.remaining)
  const walletTotalFormatted = formatQuota(walletTotal)
  const subscriptionRemaining = props.subscriptionUnlimited
    ? t('Unlimited')
    : formatQuota(props.subscriptionRemaining)
  const subscriptionTotal = props.subscriptionUnlimited
    ? t('Unlimited')
    : formatQuota(props.subscriptionTotal)

  return (
    <div className='w-full min-w-0 space-y-2.5 overflow-hidden py-1'>
      <Tooltip>
        <TooltipTrigger
          render={
            <div className='w-full min-w-0 cursor-help space-y-1 overflow-hidden' />
          }
        >
          <div className='flex min-w-0 items-center justify-between gap-3 text-xs'>
            <span className='text-muted-foreground shrink-0'>
              {t('Wallet')}
            </span>
            <span className='min-w-0 truncate font-medium tabular-nums'>
              {walletRemaining}
              <span className='text-muted-foreground font-normal'>
                {' / '}
                {walletTotalFormatted}
              </span>
            </span>
          </div>
          <Progress
            value={walletPercentage}
            className={cn('h-1.5', getQuotaProgressColor(walletPercentage))}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className='space-y-1 text-xs'>
            <div>
              {t('Used:')} {formatQuota(props.used)}
            </div>
            <div>
              {t('Remaining:')} {walletRemaining}
            </div>
            <div>
              {t('Total:')} {walletTotalFormatted}
            </div>
            <div>
              {t('Percentage:')} {walletPercentage.toFixed(1)}%
            </div>
          </div>
        </TooltipContent>
      </Tooltip>

      {props.subscriptionCount > 0 ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <div className='w-full min-w-0 cursor-help space-y-1 overflow-hidden' />
            }
          >
            <div className='flex min-w-0 items-center justify-between gap-3 text-xs'>
              <span className='text-muted-foreground shrink-0'>
                {t('Subscription')}
              </span>
              <span className='min-w-0 truncate font-medium tabular-nums'>
                {subscriptionRemaining}
                <span className='text-muted-foreground font-normal'>
                  {' / '}
                  {subscriptionTotal}
                </span>
              </span>
            </div>
            <Progress
              value={props.subscriptionUnlimited ? 100 : subscriptionPercentage}
              className={cn(
                'h-1.5',
                getQuotaProgressColor(
                  props.subscriptionUnlimited ? 100 : subscriptionPercentage
                )
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div className='space-y-1 text-xs'>
              <div>
                {t('{{count}} active subscriptions', {
                  count: props.subscriptionCount,
                })}
              </div>
              <div>
                {t('Used:')} {formatQuota(props.subscriptionUsed)}
              </div>
              <div>
                {t('Remaining:')} {subscriptionRemaining}
              </div>
              <div>
                {t('Total:')} {subscriptionTotal}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className='flex min-w-0 items-center justify-between gap-3 text-xs'>
          <span className='text-muted-foreground shrink-0'>
            {t('Subscription')}
          </span>
          <StatusBadge
            label={t('No active subscription')}
            variant='neutral'
            copyable={false}
          />
        </div>
      )}
    </div>
  )
}
