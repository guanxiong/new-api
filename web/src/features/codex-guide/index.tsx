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
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  Copy,
  FileCode2,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  TriangleAlert,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

import { CodexMotionDemo } from './components/codex-motion-demo'
import { ModelSwitchGuide } from './components/model-switch-guide'
import { CODEX_DIRECT_TOKEN_CONFIG, CODEX_PROVIDER_CONFIG } from './lib/config'

type CopyCodeProps = {
  text: string
  label: string
}

function CopyCode({ text, label }: CopyCodeProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type='button'
      onClick={() => void copy()}
      className='inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:outline-none'
      aria-label={`${t('Copy')} ${label}`}
    >
      {copied ? (
        <Check className='size-3.5 text-emerald-300' aria-hidden='true' />
      ) : (
        <Copy className='size-3.5' aria-hidden='true' />
      )}
      {copied ? t('Copied') : t('Copy')}
    </button>
  )
}

function ConfigCard({
  title,
  eyebrow,
  code,
  tone = 'recommended',
}: {
  title: string
  eyebrow: string
  code: string
  tone?: 'recommended' | 'fallback'
}) {
  return (
    <article className='overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c10]'>
      <div className='flex items-center justify-between gap-4 border-b border-white/8 px-4 py-3 sm:px-5'>
        <div className='min-w-0'>
          <p
            className={`font-mono text-[9px] tracking-[0.16em] uppercase ${tone === 'recommended' ? 'text-emerald-300' : 'text-amber-300'}`}
          >
            {eyebrow}
          </p>
          <h3 className='mt-1 truncate text-sm font-semibold text-white'>
            {title}
          </h3>
        </div>
        <CopyCode text={code} label={title} />
      </div>
      <pre className='overflow-x-auto px-5 py-5 font-mono text-[11px] leading-7 text-white/70 sm:text-xs'>
        <code>{code}</code>
      </pre>
    </article>
  )
}

export function CodexGuide() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${t('codexGuide.pageTitle')} · Share API`
    return () => {
      document.title = previousTitle
    }
  }, [t])

  const setupSteps = [
    {
      icon: KeyRound,
      title: t('codexGuide.steps.keyTitle'),
      description: t('codexGuide.steps.keyDescription'),
    },
    {
      icon: FileCode2,
      title: t('codexGuide.steps.configTitle'),
      description: t('codexGuide.steps.configDescription'),
    },
    {
      icon: RefreshCw,
      title: t('codexGuide.steps.restartTitle'),
      description: t('codexGuide.steps.restartDescription'),
    },
    {
      icon: Sparkles,
      title: t('codexGuide.steps.taskTitle'),
      description: t('codexGuide.steps.taskDescription'),
    },
  ]

  return (
    <PublicLayout showMainContainer={false}>
      <main className='min-h-svh bg-[#07080a] text-white'>
        <section className='relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pt-36 sm:pb-20 lg:px-8'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_50%_-20%,rgba(251,191,36,0.18),transparent_58%)]'
          />
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 top-64 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-amber-300/20 to-transparent'
          />

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 18, filter: 'blur(7px)' }
            }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
            className='relative mx-auto max-w-4xl text-center'
          >
            <div className='mx-auto inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/8 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-amber-200 uppercase'>
              <Terminal className='size-3.5' aria-hidden='true' />
              {t('codexGuide.badge')}
            </div>
            <h1 className='mt-7 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl'>
              {t('codexGuide.heroTitle')}
            </h1>
            <p className='mx-auto mt-6 max-w-2xl text-base leading-7 text-pretty text-white/55 sm:text-lg sm:leading-8'>
              {t('codexGuide.heroDescription')}
            </p>
            <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
              <Button
                size='lg'
                className='h-11 rounded-full bg-amber-300 px-5 text-sm font-semibold text-black hover:bg-amber-200'
                render={
                  isAuthenticated ? (
                    <Link to='/keys' />
                  ) : (
                    <Link to='/register' />
                  )
                }
              >
                {isAuthenticated
                  ? t('codexGuide.openKeys')
                  : t('codexGuide.createAccount')}
                <ArrowRight className='size-4' aria-hidden='true' />
              </Button>
              <a
                href='#setup'
                className='inline-flex h-11 items-center rounded-full border border-white/12 bg-white/5 px-5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:outline-none'
              >
                {t('codexGuide.viewConfig')}
              </a>
            </div>
          </motion.div>
        </section>

        <section className='px-4 pb-20 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-6xl'>
            <CodexMotionDemo />
          </div>
        </section>

        <ModelSwitchGuide />

        <section
          id='setup'
          className='border-y border-white/8 bg-white/[0.02] px-4 py-20 sm:px-6 lg:px-8'
        >
          <div className='mx-auto max-w-6xl'>
            <div className='max-w-2xl'>
              <p className='font-mono text-[10px] tracking-[0.18em] text-amber-300 uppercase'>
                {t('codexGuide.setupEyebrow')}
              </p>
              <h2 className='mt-4 text-3xl font-semibold tracking-tight sm:text-4xl'>
                {t('codexGuide.setupTitle')}
              </h2>
              <p className='mt-4 text-base leading-7 text-white/55'>
                {t('codexGuide.setupDescription')}
              </p>
            </div>

            <ol className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {setupSteps.map((item, index) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.title}
                    className='rounded-2xl border border-white/9 bg-black/25 p-5'
                  >
                    <div className='flex items-center justify-between'>
                      <span className='flex size-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300'>
                        <Icon className='size-4.5' aria-hidden='true' />
                      </span>
                      <span className='font-mono text-xs text-white/25'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className='mt-5 text-base font-semibold text-white'>
                      {item.title}
                    </h3>
                    <p className='mt-2 text-sm leading-6 text-white/50'>
                      {item.description}
                    </p>
                  </li>
                )
              })}
            </ol>

            <div className='mt-10 grid gap-5 lg:grid-cols-2'>
              <ConfigCard
                eyebrow={t('codexGuide.recommended')}
                title='~/.codex/config.toml'
                code={CODEX_PROVIDER_CONFIG}
              />

              <div className='rounded-2xl border border-white/9 bg-black/25 p-5 sm:p-6'>
                <div className='flex items-start gap-3'>
                  <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300'>
                    <ShieldCheck className='size-4.5' aria-hidden='true' />
                  </span>
                  <div>
                    <h3 className='font-semibold text-white'>
                      {t('codexGuide.envTitle')}
                    </h3>
                    <p className='mt-1 text-sm leading-6 text-white/50'>
                      {t('codexGuide.envDescription')}
                    </p>
                  </div>
                </div>
                <div className='mt-5 rounded-xl border border-white/8 bg-[#0b0c10] p-4 font-mono text-xs leading-6 text-white/65'>
                  <span className='text-white/30'>$ </span>
                  export SHAREAPI_API_KEY=&quot;&lt;Share API Token&gt;&quot;
                </div>
                <p className='mt-4 text-xs leading-5 text-white/35'>
                  {t('codexGuide.envRestartNote')}
                </p>
              </div>
            </div>

            <details className='group mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.035]'>
              <summary className='flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-medium text-amber-100 focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:outline-none [&::-webkit-details-marker]:hidden'>
                <TriangleAlert
                  className='size-4 text-amber-300'
                  aria-hidden='true'
                />
                <span>{t('codexGuide.fallbackTitle')}</span>
                <span className='ml-auto text-white/35 transition-transform group-open:rotate-90'>
                  →
                </span>
              </summary>
              <div className='border-t border-amber-300/10 p-4 sm:p-5'>
                <p className='mb-4 max-w-3xl text-sm leading-6 text-white/50'>
                  {t('codexGuide.fallbackDescription')}
                </p>
                <ConfigCard
                  eyebrow={t('codexGuide.fallback')}
                  title={t('codexGuide.directTokenTitle')}
                  code={CODEX_DIRECT_TOKEN_CONFIG}
                  tone='fallback'
                />
              </div>
            </details>
          </div>
        </section>

        <section className='px-4 py-20 sm:px-6 lg:px-8'>
          <div className='mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start'>
            <div>
              <p className='font-mono text-[10px] tracking-[0.18em] text-amber-300 uppercase'>
                {t('codexGuide.verifyEyebrow')}
              </p>
              <h2 className='mt-4 text-3xl font-semibold tracking-tight sm:text-4xl'>
                {t('codexGuide.verifyTitle')}
              </h2>
              <p className='mt-4 text-sm leading-7 text-white/50'>
                {t('codexGuide.verifyDescription')}
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              {[
                [
                  t('codexGuide.check.newTaskTitle'),
                  t('codexGuide.check.newTaskDescription'),
                ],
                [
                  t('codexGuide.check.modelTitle'),
                  t('codexGuide.check.modelDescription'),
                ],
                [
                  t('codexGuide.check.endpointTitle'),
                  t('codexGuide.check.endpointDescription'),
                ],
                [
                  t('codexGuide.check.authTitle'),
                  t('codexGuide.check.authDescription'),
                ],
              ].map(([title, description]) => (
                <article
                  key={title}
                  className='rounded-2xl border border-white/9 bg-white/[0.025] p-5'
                >
                  <CheckCircleIcon />
                  <h3 className='mt-4 font-semibold text-white'>{title}</h3>
                  <p className='mt-2 text-sm leading-6 text-white/50'>
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className='px-4 pb-20 sm:px-6 lg:px-8'>
          <div className='mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 overflow-hidden rounded-[2rem] border border-amber-300/15 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.16),transparent_45%),#0b0c0f] p-7 sm:p-10 lg:flex-row lg:items-center'>
            <div className='max-w-2xl'>
              <p className='font-mono text-[10px] tracking-[0.18em] text-amber-300 uppercase'>
                {t('codexGuide.ctaEyebrow')}
              </p>
              <h2 className='mt-3 text-2xl font-semibold tracking-tight sm:text-3xl'>
                {t('codexGuide.ctaTitle')}
              </h2>
              <p className='mt-3 text-sm leading-6 text-white/50'>
                {t('codexGuide.ctaDescription')}
              </p>
            </div>
            <Button
              size='lg'
              className='h-11 rounded-full bg-amber-300 px-5 text-sm font-semibold text-black hover:bg-amber-200'
              render={
                isAuthenticated ? <Link to='/keys' /> : <Link to='/register' />
              }
            >
              {isAuthenticated
                ? t('codexGuide.openKeys')
                : t('codexGuide.createAccount')}
              <ArrowRight className='size-4' aria-hidden='true' />
            </Button>
          </div>
        </section>
      </main>
      <div className='dark bg-[#07080a] text-white'>
        <Footer className='border-white/8' />
      </div>
    </PublicLayout>
  )
}

function CheckCircleIcon() {
  return (
    <span className='flex size-8 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/8 text-emerald-300'>
      <Check className='size-4' aria-hidden='true' />
    </span>
  )
}
