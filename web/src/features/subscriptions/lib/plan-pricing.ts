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
import type { SubscriptionCurrency } from '../types'

export function normalizePlanCurrency(
  currency: string | null | undefined
): SubscriptionCurrency {
  return currency?.trim().toUpperCase() === 'CNY' ? 'CNY' : 'USD'
}

export function formatPlanPrice(
  amount: number,
  currency: string | null | undefined,
  showCode = false
): string {
  const normalized = normalizePlanCurrency(currency)
  const symbol = normalized === 'CNY' ? '¥' : '$'
  const numericAmount = Number.isFinite(amount) ? amount : 0
  const formatted = `${symbol}${numericAmount.toFixed(2)}`
  return showCode ? `${formatted} ${normalized}` : formatted
}

export function calculatePlanBalanceQuota(
  priceAmount: number,
  currency: string | null | undefined,
  cnyPerUSD: number,
  quotaPerUSD: number
): number {
  const normalized = normalizePlanCurrency(currency)
  const validRate = Number.isFinite(cnyPerUSD) && cnyPerUSD > 0 ? cnyPerUSD : 1
  const validQuotaPerUSD =
    Number.isFinite(quotaPerUSD) && quotaPerUSD > 0 ? quotaPerUSD : 0
  const amountInUSD =
    normalized === 'CNY' ? priceAmount / validRate : priceAmount
  return Math.max(0, Math.ceil(amountInUSD * validQuotaPerUSD))
}
