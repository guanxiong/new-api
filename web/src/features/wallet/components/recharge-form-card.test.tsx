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
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { TopupInfo } from '../types'
import { RechargeFormCard } from './recharge-form-card'

const topupInfo: TopupInfo = {
  enable_online_topup: true,
  enable_stripe_topup: false,
  pay_methods: [{ name: 'WeChat', type: 'wechat', currency: 'CNY' }],
  min_topup: 1,
  stripe_min_topup: 1,
  amount_options: [10, 20, 50, 100],
  discount: {},
}

describe('RechargeFormCard preset layout', () => {
  it('renders four roomy preset cards in the responsive four-column grid', () => {
    const rendered = render(
      <RechargeFormCard
        topupInfo={topupInfo}
        presetAmounts={topupInfo.amount_options.map((value) => ({ value }))}
        selectedPreset={null}
        onSelectPreset={vi.fn()}
        topupAmount={10}
        onTopupAmountChange={vi.fn()}
        paymentAmount={10}
        calculating={false}
        onPaymentMethodSelect={vi.fn()}
        paymentLoading={null}
        redemptionCode=''
        onRedemptionCodeChange={vi.fn()}
        onRedeem={vi.fn()}
        redeeming={false}
      />
    )

    const grid = rendered.container.querySelector('[data-topup-presets]')
    const presets = rendered.container.querySelectorAll('[data-topup-preset]')

    expect(grid).toHaveClass('md:grid-cols-4')
    expect(presets).toHaveLength(4)
    presets.forEach((preset) => {
      expect(preset).toHaveClass('min-h-[88px]', 'py-4', 'justify-center')
    })
  })
})
