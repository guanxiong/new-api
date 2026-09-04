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
import { ExternalLink, Gift, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { TitledCard } from '@/components/ui/titled-card'

interface RedemptionCodeCardProps {
  value: string
  onValueChange: (value: string) => void
  onRedeem: () => void
  redeeming: boolean
  enabled?: boolean
  topupLink?: string
  loading?: boolean
}

export function RedemptionCodeCard({
  value,
  onValueChange,
  onRedeem,
  redeeming,
  enabled = true,
  topupLink,
  loading,
}: RedemptionCodeCardProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card
        data-redemption-card
        data-card-hover='false'
        className='gap-0 overflow-hidden py-0'
      >
        <CardHeader className='border-b p-3 !pb-3 sm:p-4 sm:!pb-4'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='mt-1.5 h-3 w-40' />
        </CardHeader>
        <CardContent className='space-y-3 p-3 sm:p-4'>
          <div className='flex gap-2'>
            <Skeleton className='h-9 flex-1' />
            <Skeleton className='h-9 w-20' />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <TitledCard
      title={t('Redeem codes')}
      description={t('Enter your redemption code')}
      icon={<Gift className='h-4 w-4' />}
      iconTone='warning'
      disableHoverEffect
      className='bg-muted/10'
      headerClassName='sm:p-4 sm:!pb-4'
      contentClassName='space-y-3 sm:p-4'
    >
      {enabled ? (
        <>
          <Label htmlFor='wallet-redemption-code' className='sr-only'>
            {t('Enter your redemption code')}
          </Label>
          <div className='grid grid-cols-[minmax(0,1fr)_auto] gap-2'>
            <Input
              id='wallet-redemption-code'
              value={value}
              onChange={(event) => onValueChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && value.trim() && !redeeming) {
                  onRedeem()
                }
              }}
              placeholder={t('Enter your redemption code')}
              className='bg-background h-9 min-w-0'
            />
            <Button
              onClick={onRedeem}
              disabled={redeeming || !value.trim()}
              variant='outline'
              className='bg-background h-9 px-4'
            >
              {redeeming && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {t('Redeem')}
            </Button>
          </div>
          {topupLink && (
            <p className='text-muted-foreground text-xs'>
              {t('Need a redemption code?')}{' '}
              <a
                href={topupLink}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1 underline-offset-4 hover:underline'
              >
                {t('Get one here')}
                <ExternalLink className='h-3 w-3' />
              </a>
            </p>
          )}
        </>
      ) : (
        <Alert>
          <AlertDescription>
            {t(
              'Redemption codes are disabled until the administrator confirms compliance terms.'
            )}
          </AlertDescription>
        </Alert>
      )}
    </TitledCard>
  )
}
