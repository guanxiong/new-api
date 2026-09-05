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
import { render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, test } from 'vitest'

import { TooltipProvider } from '@/components/ui/tooltip'

import { UserQuotaCell } from '../user-quota-cell'

function renderQuotaCell(
  props: React.ComponentProps<typeof UserQuotaCell>
): ReturnType<typeof render> {
  return render(
    <TooltipProvider>
      <UserQuotaCell {...props} />
    </TooltipProvider>
  )
}

describe('user quota cell', () => {
  test('shows wallet and active subscription balances as separate labeled rows', () => {
    renderQuotaCell({
      used: 25_000_000,
      remaining: 50_000_000,
      subscriptionCount: 2,
      subscriptionTotal: 999_000_000,
      subscriptionUsed: 250_000_000,
      subscriptionRemaining: 749_000_000,
      subscriptionUnlimited: false,
    })

    expect(screen.getByText('Wallet')).toBeInTheDocument()
    expect(screen.getByText('Subscription')).toBeInTheDocument()
    expect(screen.getByText('$1,498')).toBeInTheDocument()
  })

  test('states that no active subscription exists instead of showing a zero balance', () => {
    renderQuotaCell({
      used: 0,
      remaining: 1_000_000,
      subscriptionCount: 0,
      subscriptionTotal: 0,
      subscriptionUsed: 0,
      subscriptionRemaining: 0,
      subscriptionUnlimited: false,
    })

    expect(screen.getByText('No active subscription')).toBeInTheDocument()
  })
})
