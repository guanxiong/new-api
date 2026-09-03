/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { describe, expect, it } from 'vitest'

import { calculatePlanBalanceQuota, formatPlanPrice } from '../plan-pricing'

describe('subscription plan pricing', () => {
  it('labels a CNY checkout price explicitly', () => {
    expect(formatPlanPrice(59, 'CNY', true)).toBe('¥59.00 CNY')
  })

  it('labels a USD checkout price explicitly', () => {
    expect(formatPlanPrice(10, 'USD', true)).toBe('$10.00 USD')
  })

  it('converts CNY checkout price to equivalent wallet quota', () => {
    expect(calculatePlanBalanceQuota(73, 'CNY', 7.3, 500_000)).toBe(5_000_000)
  })

  it('preserves current one-to-one CNY and wallet-credit pricing', () => {
    expect(calculatePlanBalanceQuota(59, 'CNY', 1, 500_000)).toBe(29_500_000)
  })
})
