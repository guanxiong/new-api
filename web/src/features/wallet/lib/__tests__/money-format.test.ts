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

import { formatApiCredit, formatPaymentAmount } from '../format'

describe('wallet money formatting', () => {
  it('labels system API credit as USD', () => {
    expect(formatApiCredit(10, 'USD')).toBe('$10 USD')
  })

  it('labels token credit without a currency symbol', () => {
    expect(formatApiCredit(500_000, 'TOKENS')).toBe('500,000 Tokens')
  })

  it('labels a CNY payment explicitly', () => {
    expect(formatPaymentAmount(10, 'CNY')).toBe('¥10 CNY')
  })

  it('labels a USD payment explicitly', () => {
    expect(formatPaymentAmount(10, 'USD')).toBe('$10 USD')
  })
})
