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
import { describe, expect, test } from 'vitest'

import { resolveAuthenticatedHomeCtas } from '../auth-aware-content'

function renderFragment(content: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = content
  return container
}

describe('authenticated custom home CTAs', () => {
  test('keeps guest content byte-for-byte unchanged', () => {
    const content =
      '<a data-auth-cta href="/register" class="cta">立即注册 →</a>'

    expect(resolveAuthenticatedHomeCtas(content, false, 'Dashboard')).toBe(
      content
    )
  })

  test('rewrites only marked links after authentication', () => {
    const result = resolveAuthenticatedHomeCtas(
      [
        '<a data-auth-cta href="/register">立即注册 →</a>',
        '<a href="/pricing">查看订阅</a>',
      ].join(''),
      true,
      'Go to Dashboard'
    )
    const container = renderFragment(result)
    const markedLink =
      container.querySelector<HTMLAnchorElement>('a[data-auth-cta]')
    const pricingLink =
      container.querySelector<HTMLAnchorElement>('a[href="/pricing"]')

    expect(markedLink?.getAttribute('href')).toBe('/dashboard')
    expect(markedLink?.textContent).toBe('Go to Dashboard')
    expect(pricingLink?.textContent).toBe('查看订阅')
  })

  test('uses custom destination and label without removing adjacent icons', () => {
    const result = resolveAuthenticatedHomeCtas(
      [
        '<a data-auth-cta data-authenticated-href="/keys" ',
        'data-authenticated-label="进入控制台" href="/register">',
        '<span data-auth-cta-label>立即注册</span>',
        '<span aria-hidden="true">→</span></a>',
      ].join(''),
      true,
      'Go to Dashboard'
    )
    const container = renderFragment(result)
    const link = container.querySelector<HTMLAnchorElement>('a')

    expect(link?.getAttribute('href')).toBe('/keys')
    expect(link?.querySelector('[data-auth-cta-label]')?.textContent).toBe(
      '进入控制台'
    )
    expect(link?.querySelector('[aria-hidden="true"]')?.textContent).toBe('→')
  })
})
