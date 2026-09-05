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

import { usersSearchSchema } from '../user-search'

describe('users search defaults', () => {
  test('shows enabled users when the page opens without a status query', () => {
    expect(usersSearchSchema.parse({}).status).toEqual(['1'])
  })

  test('keeps an explicitly selected disabled status', () => {
    expect(usersSearchSchema.parse({ status: ['2'] }).status).toEqual(['2'])
  })
})
