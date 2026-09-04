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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SubscriptionPlansPage } from '../subscription-plans-page'

const mocks = vi.hoisted(() => ({
  getSelf: vi.fn(),
  useTopupInfo: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  getSelf: mocks.getSelf,
}))

vi.mock('@/features/wallet/hooks', () => ({
  useTopupInfo: mocks.useTopupInfo,
}))

vi.mock('@/features/wallet/components/subscription-plans-card', () => ({
  SubscriptionPlansCard: (props: { userQuota?: number }) => (
    <section
      aria-label='Subscription plan content'
      data-user-quota={props.userQuota}
    />
  ),
}))

describe('SubscriptionPlansPage', () => {
  beforeEach(() => {
    mocks.useTopupInfo.mockReturnValue({ topupInfo: { pay_methods: [] } })
    mocks.getSelf.mockResolvedValue({
      success: true,
      data: { quota: 50_000_000 },
    })
  })

  it('renders subscription purchasing on a dedicated full-width page', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <SubscriptionPlansPage />
      </QueryClientProvider>
    )

    expect(
      screen.getByRole('heading', { name: 'Subscription Plans' })
    ).toBeInTheDocument()
    const content = screen.getByRole('region', {
      name: 'Subscription plan content',
    })
    expect(content.closest('[data-subscription-plans-page]')).toHaveClass(
      'w-full',
      'max-w-7xl'
    )
    await waitFor(() => {
      expect(content).toHaveAttribute('data-user-quota', '50000000')
    })
  })
})
