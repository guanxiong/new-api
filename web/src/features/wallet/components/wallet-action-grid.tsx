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
import type { ReactNode } from 'react'

interface WalletActionGridProps {
  children: ReactNode
}

export function WalletActionGrid({ children }: WalletActionGridProps) {
  return (
    <div
      data-wallet-action-grid
      className='grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.65fr)] xl:items-start'
    >
      {children}
    </div>
  )
}
