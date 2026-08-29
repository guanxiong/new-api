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
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { CodexMotionDemo } from './codex-motion-demo'

describe('Codex motion guide', () => {
  test('exposes every animation beat as a keyboard-accessible step', async () => {
    const user = userEvent.setup()
    const { container } = render(<CodexMotionDemo autoPlay={false} />)

    const steps =
      container.querySelectorAll<HTMLButtonElement>('[data-codex-step]')
    expect(steps).toHaveLength(4)
    expect(steps[0]).toHaveAttribute('aria-current', 'step')

    await user.click(steps[2])

    expect(steps[2]).toHaveAttribute('aria-current', 'step')
    expect(steps[0]).not.toHaveAttribute('aria-current')
    expect(
      await screen.findAllByText('llm.shareapi.ai/v1/responses')
    ).not.toHaveLength(0)
  })

  test('renders a complete static state when reduced motion is requested', () => {
    const { container } = render(
      <CodexMotionDemo autoPlay shouldReduceMotion />
    )

    const demo = container.querySelector('[data-codex-motion-demo]')
    const taskStep = container.querySelector('[data-codex-step="task"]')

    expect(demo).toHaveAttribute('data-reduced-motion', 'true')
    expect(taskStep).toHaveAttribute('aria-current', 'step')
    expect(
      screen.getByRole('button', { name: 'codexGuide.motion.replay' })
    ).toBeDisabled()
  })
})
