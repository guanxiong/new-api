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
import { describe, expect, it } from 'vitest'

import { WalletActionGrid } from './wallet-action-grid'

describe('WalletActionGrid', () => {
  it('keeps wallet actions stacked until the extra-large two-column layout', () => {
    const { container } = render(
      <WalletActionGrid>
        <section>添加资金</section>
        <aside>推荐计划</aside>
      </WalletActionGrid>
    )

    const grid = container.querySelector('[data-wallet-action-grid]')

    expect(grid).toHaveClass(
      'grid',
      'gap-4',
      'xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.65fr)]',
      'xl:items-start'
    )
    expect(screen.getByText('添加资金')).toBeInTheDocument()
    expect(screen.getByText('推荐计划')).toBeInTheDocument()
  })
})
