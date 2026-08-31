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
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { ConfigCard } from '../config-card'

const originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform')
const originalUserAgent = Object.getOwnPropertyDescriptor(
  navigator,
  'userAgent'
)
const originalPicker = Object.getOwnPropertyDescriptor(
  window,
  'showOpenFilePicker'
)

function restoreProperty(
  target: object,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined
) {
  if (descriptor) {
    Object.defineProperty(target, property, descriptor)
  } else {
    Reflect.deleteProperty(target, property)
  }
}

function setBrowser({
  platform,
  userAgent,
  picker,
}: {
  platform: string
  userAgent: string
  picker?: ReturnType<typeof vi.fn>
}) {
  Object.defineProperty(navigator, 'platform', {
    configurable: true,
    value: platform,
  })
  Object.defineProperty(navigator, 'userAgent', {
    configurable: true,
    value: userAgent,
  })
  if (picker) {
    Object.defineProperty(window, 'showOpenFilePicker', {
      configurable: true,
      value: picker,
    })
  } else {
    Reflect.deleteProperty(window, 'showOpenFilePicker')
  }
}

function renderEditableCard() {
  return render(
    <ConfigCard
      title='~/.codex/config.toml'
      eyebrow='Recommended'
      code='model = "gpt-5.6"'
      allowLocalFileEditing
    />
  )
}

afterEach(() => {
  restoreProperty(navigator, 'platform', originalPlatform)
  restoreProperty(navigator, 'userAgent', originalUserAgent)
  restoreProperty(window, 'showOpenFilePicker', originalPicker)
  vi.restoreAllMocks()
})

describe('Codex config card local file editor', () => {
  test('shows the local file button on supported Mac Chromium browsers', async () => {
    setBrowser({
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 Chrome/128.0.0.0 Safari/537.36',
      picker: vi.fn(),
    })

    renderEditableCard()

    expect(
      await screen.findByRole('button', {
        name: 'codexGuide.localEditor.openButton',
      })
    ).toBeInTheDocument()
  })

  test('hides the local file button outside supported Mac Chromium browsers', async () => {
    setBrowser({
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 Chrome/128.0.0.0 Safari/537.36',
      picker: vi.fn(),
    })

    renderEditableCard()

    await waitFor(() => {
      expect(
        screen.queryByRole('button', {
          name: 'codexGuide.localEditor.openButton',
        })
      ).not.toBeInTheDocument()
    })

    setBrowser({
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 Version/18.0 Safari/605.1.15',
    })
    renderEditableCard()

    expect(
      screen.queryByRole('button', {
        name: 'codexGuide.localEditor.openButton',
      })
    ).not.toBeInTheDocument()
  })

  test('opens, edits, and saves the selected config.toml locally', async () => {
    const user = userEvent.setup()
    const write = vi.fn().mockResolvedValue(undefined)
    const close = vi.fn().mockResolvedValue(undefined)
    const initialContents = 'model = "gpt-5.6-sol"'
    const file = {
      name: 'config.toml',
      size: initialContents.length,
      text: vi.fn().mockResolvedValue(initialContents),
    }
    const picker = vi.fn().mockResolvedValue([
      {
        name: 'config.toml',
        getFile: vi.fn().mockResolvedValue(file),
        createWritable: vi.fn().mockResolvedValue({ write, close }),
      },
    ])
    setBrowser({
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 Edg/128.0.0.0 Chrome/128.0.0.0',
      picker,
    })
    renderEditableCard()

    await user.click(
      await screen.findByRole('button', {
        name: 'codexGuide.localEditor.openButton',
      })
    )

    expect(picker).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'shareapi-codex-config',
        multiple: false,
      })
    )
    const editor = await screen.findByLabelText('config.toml')
    expect(editor).toHaveValue(initialContents)

    await user.clear(editor)
    await user.type(editor, 'model = "gpt-5.6-luna"')
    await user.click(
      screen.getByRole('button', {
        name: 'codexGuide.localEditor.saveButton',
      })
    )

    expect(write).toHaveBeenCalledWith('model = "gpt-5.6-luna"')
    expect(close).toHaveBeenCalledOnce()
    expect(screen.getByText('codexGuide.localEditor.saved')).toBeInTheDocument()
  })

  test('does not expose an editor when the picker is cancelled', async () => {
    const user = userEvent.setup()
    const picker = vi
      .fn()
      .mockRejectedValue(new DOMException('Cancelled', 'AbortError'))
    setBrowser({
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 Chrome/128.0.0.0 Safari/537.36',
      picker,
    })
    renderEditableCard()

    await user.click(
      await screen.findByRole('button', {
        name: 'codexGuide.localEditor.openButton',
      })
    )

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('rejects a selected file that is not named config.toml', async () => {
    const user = userEvent.setup()
    const picker = vi.fn().mockResolvedValue([
      {
        name: 'other.toml',
        getFile: vi.fn().mockResolvedValue({
          name: 'other.toml',
          size: 10,
          text: vi.fn().mockResolvedValue('model = "other"'),
        }),
        createWritable: vi.fn(),
      },
    ])
    setBrowser({
      platform: 'MacIntel',
      userAgent: 'Mozilla/5.0 Chrome/128.0.0.0 Safari/537.36',
      picker,
    })
    renderEditableCard()

    await user.click(
      await screen.findByRole('button', {
        name: 'codexGuide.localEditor.openButton',
      })
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'codexGuide.localEditor.invalidFile'
    )
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
