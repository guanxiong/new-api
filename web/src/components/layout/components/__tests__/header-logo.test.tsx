import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeaderLogo } from '../header-logo'

describe('HeaderLogo', () => {
  it('preserves a rounded-square brand mark instead of clipping it to a circle', () => {
    render(
      <HeaderLogo
        src='/shareapi-logo.svg'
        alt='Share API'
        loading={false}
        logoLoaded
        className='rounded-lg'
      />
    )

    const logo = screen.getByRole('img', { name: 'Share API' })
    expect(logo).toHaveClass('rounded-[22%]')
    expect(logo).not.toHaveClass('rounded-lg')
    expect(logo).not.toHaveClass('rounded-full')
  })
})
