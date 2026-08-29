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
import { ArrowRight, CheckCircle2, FileCode2, Server } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

const SIGNAL_NODES = [
  { icon: FileCode2, label: 'config.toml' },
  { icon: Server, label: 'Share API' },
  { icon: CheckCircle2, label: 'gpt-5.6' },
] as const

export function CodexGuideTeaser() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className='relative overflow-hidden border-t border-white/8 bg-[#08090b] px-4 py-20 text-white sm:px-6 lg:px-8'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(251,191,36,0.12),transparent_38%)]'
      />
      <div className='relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center'>
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 14, filter: 'blur(5px)' }
          }
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
        >
          <p className='font-mono text-[10px] tracking-[0.18em] text-amber-300 uppercase'>
            {t('codexGuide.teaserEyebrow')}
          </p>
          <h2 className='mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>
            {t('codexGuide.teaserTitle')}
          </h2>
          <p className='mt-4 max-w-xl text-sm leading-7 text-white/50 sm:text-base'>
            {t('codexGuide.teaserDescription')}
          </p>
          <Link
            to='/codex'
            className='mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-amber-300 px-5 text-sm font-semibold text-black transition-colors hover:bg-amber-200 focus-visible:ring-2 focus-visible:ring-amber-100 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none'
          >
            {t('codexGuide.teaserCta')}
            <ArrowRight className='size-4' aria-hidden='true' />
          </Link>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.33, 1, 0.68, 1] }}
          className='relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 sm:p-7'
        >
          <div className='flex items-center justify-between border-b border-white/8 pb-4'>
            <span className='font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase'>
              {t('codexGuide.teaserFlow')}
            </span>
            <span className='rounded-full bg-emerald-300/8 px-2 py-1 font-mono text-[9px] tracking-wider text-emerald-300 uppercase'>
              {t('codexGuide.motion.ready')}
            </span>
          </div>

          <div className='relative mt-7 grid grid-cols-3 gap-2'>
            <div
              aria-hidden='true'
              className='absolute top-6 right-[16.66%] left-[16.66%] h-px bg-white/10'
            >
              <motion.span
                data-codex-teaser-signal
                className='block h-px origin-left bg-gradient-to-r from-amber-300 via-orange-400 to-emerald-300 shadow-[0_0_14px_rgba(251,191,36,0.65)]'
                initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 1.05,
                  delay: 0.25,
                }}
              />
            </div>

            {SIGNAL_NODES.map((node, index) => {
              const Icon = node.icon
              return (
                <div
                  key={node.label}
                  className='relative z-10 flex min-w-0 flex-col items-center text-center'
                >
                  <motion.span
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 7, scale: 0.94 }
                    }
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{
                      duration: 0.35,
                      delay: shouldReduceMotion ? 0 : 0.15 + index * 0.23,
                      ease: [0.33, 1, 0.68, 1],
                    }}
                    className={`flex size-12 items-center justify-center rounded-2xl border ${index === SIGNAL_NODES.length - 1 ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-300' : 'border-amber-300/20 bg-[#101114] text-amber-300'}`}
                  >
                    <Icon className='size-4.5' aria-hidden='true' />
                  </motion.span>
                  <span className='mt-3 truncate font-mono text-[9px] tracking-wider text-white/40 sm:text-[10px]'>
                    {node.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className='mt-7 rounded-xl border border-white/8 bg-black/30 px-4 py-3 font-mono text-[10px] text-white/40 sm:text-xs'>
            POST /v1/responses
            <span className='float-right text-emerald-300'>200 OK</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
