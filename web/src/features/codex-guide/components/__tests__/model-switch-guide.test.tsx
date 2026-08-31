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
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { ModelSwitchGuide } from '../model-switch-guide'

afterEach(() => {
  window.history.replaceState(null, '', '/codex')
  vi.restoreAllMocks()
})

describe('Codex model switch guide', () => {
  test('shows exact Sol, Terra, and Luna model IDs', () => {
    render(<ModelSwitchGuide />)

    expect(screen.getByText('gpt-5.6-sol')).toBeInTheDocument()
    expect(screen.getByText('gpt-5.6-terra')).toBeInTheDocument()
    expect(screen.getByText('gpt-5.6-luna')).toBeInTheDocument()
    expect(screen.getByText('model = "gpt-5.6-luna"')).toBeInTheDocument()
  })

  test('scrolls the shared hash link directly to the switch guide', async () => {
    const scrollIntoView = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    })
    window.history.replaceState(null, '', '/codex#switch-model')

    render(<ModelSwitchGuide />)

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' })
    })
  })
})
