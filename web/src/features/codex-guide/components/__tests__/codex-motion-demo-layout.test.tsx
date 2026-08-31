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
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { CodexMotionDemo } from '../codex-motion-demo'

describe('Codex motion guide layout', () => {
  test('keeps the active step node on the progress-line baseline', async () => {
    const user = userEvent.setup()
    const { container } = render(<CodexMotionDemo autoPlay={false} />)
    const taskStep = container.querySelector<HTMLButtonElement>(
      '[data-codex-step="task"]'
    )

    if (!taskStep) {
      throw new Error('Expected the task step to be rendered')
    }
    await user.click(taskStep)

    const taskNode = taskStep.querySelector<HTMLElement>(
      '[data-codex-step-node]'
    )
    if (!taskNode) {
      throw new Error('Expected the task step node to be rendered')
    }
    expect(taskNode.style.transform).not.toContain('translate')
  })

  test('draws keyboard focus around the compact node instead of the grid cell', () => {
    const { container } = render(<CodexMotionDemo autoPlay={false} />)
    const firstStep = container.querySelector<HTMLButtonElement>(
      '[data-codex-step="config"]'
    )
    const firstNode = firstStep?.querySelector<HTMLElement>(
      '[data-codex-step-node]'
    )

    expect(firstStep).not.toBeNull()
    expect(firstStep).not.toHaveClass('focus-visible:ring-2')
    expect(firstNode).toHaveClass('group-focus-visible:ring-2')
  })
})
