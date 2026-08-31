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
import {
  CheckCircle2,
  FileCode2,
  KeyRound,
  Pause,
  Play,
  RotateCcw,
  Server,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import {
  CODEX_MOTION_STEPS,
  CODEX_PROVIDER_CONFIG_LINES,
} from '../lib/config'

const STEP_INTERVAL_MS = 1250

const STEP_ICONS = [FileCode2, KeyRound, Server, CheckCircle2] as const

type CodexMotionDemoProps = {
  autoPlay?: boolean
  shouldReduceMotion?: boolean
}

export function CodexMotionDemo({
  autoPlay = true,
  shouldReduceMotion,
}: CodexMotionDemoProps) {
  const { t } = useTranslation()
  const systemReducedMotion = useReducedMotion()
  const reduceMotion = shouldReduceMotion ?? !!systemReducedMotion
  const [activeStep, setActiveStep] = useState(reduceMotion ? 3 : 0)
  const [isPlaying, setIsPlaying] = useState(autoPlay && !reduceMotion)

  const step = CODEX_MOTION_STEPS[activeStep]
  const highlightedLines = useMemo(
    () => new Set<number>(step.highlightedLines),
    [step.highlightedLines]
  )
  const isLastStep = activeStep >= CODEX_MOTION_STEPS.length - 1
  const isAnimating = isPlaying && !isLastStep
  let PlaybackIcon = Play
  if (isAnimating) {
    PlaybackIcon = Pause
  } else if (isLastStep) {
    PlaybackIcon = RotateCcw
  }
  const playbackLabel = isAnimating
    ? t('codexGuide.motion.pause')
    : t('codexGuide.motion.replay')

  useEffect(() => {
    if (!isAnimating || reduceMotion) return

    const timeoutId = window.setTimeout(() => {
      setActiveStep((current) => current + 1)
    }, STEP_INTERVAL_MS)

    return () => window.clearTimeout(timeoutId)
  }, [activeStep, isAnimating, reduceMotion])

  const selectStep = (index: number) => {
    setActiveStep(index)
    setIsPlaying(false)
  }

  const togglePlayback = () => {
    if (reduceMotion) return

    if (isAnimating) {
      setIsPlaying(false)
      return
    }

    if (isLastStep) {
      setActiveStep(0)
    }
    setIsPlaying(true)
  }

  return (
    <section
      aria-labelledby='codex-motion-title'
      data-codex-motion-demo
      data-reduced-motion={reduceMotion ? 'true' : 'false'}
      className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090a0d] text-white shadow-[0_42px_120px_-48px_rgba(0,0,0,0.9)]'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-40 left-1/3 size-[28rem] rounded-full bg-amber-400/10 blur-[120px]'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-orange-500/10 blur-[100px]'
      />

      <div className='relative flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-7'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='flex gap-1.5' aria-hidden='true'>
            <span className='size-2 rounded-full bg-[#ff6b57]' />
            <span className='size-2 rounded-full bg-[#ffbd2e]' />
            <span className='size-2 rounded-full bg-[#28c840]' />
          </div>
          <div className='h-4 w-px bg-white/10' />
          <p
            id='codex-motion-title'
            className='truncate font-mono text-[11px] tracking-[0.16em] text-white/50 uppercase'
          >
            {t('codexGuide.motion.windowTitle')}
          </p>
        </div>

        <button
          type='button'
          onClick={togglePlayback}
          disabled={reduceMotion}
          className='inline-flex h-8 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:outline-none disabled:cursor-default disabled:opacity-50'
          aria-label={playbackLabel}
        >
          <PlaybackIcon className='size-3.5' aria-hidden='true' />
          <span className='hidden sm:inline'>{playbackLabel}</span>
        </button>
      </div>

      <div className='relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:p-8'>
        <div className='overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-black/30'>
          <div className='flex items-center justify-between border-b border-white/8 px-4 py-3'>
            <div className='flex items-center gap-2 text-xs text-white/55'>
              <FileCode2 className='size-3.5 text-amber-300' aria-hidden='true' />
              <span>~/.codex/config.toml</span>
            </div>
            <span className='rounded-full border border-emerald-300/15 bg-emerald-300/8 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-emerald-300/80 uppercase'>
              {t('codexGuide.motion.ready')}
            </span>
          </div>

          <pre className='overflow-x-auto px-2 py-4 font-mono text-[11px] leading-7 sm:px-3 sm:text-xs'>
            <code>
              {CODEX_PROVIDER_CONFIG_LINES.map((line, index) => {
                const highlighted = highlightedLines.has(index)
                return (
                  <motion.span
                    key={line || 'blank-line'}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            backgroundColor: highlighted
                              ? 'rgba(251, 191, 36, 0.12)'
                              : 'rgba(0, 0, 0, 0)',
                          }
                    }
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className={cn(
                      'grid min-w-max grid-cols-[2rem_1fr] rounded-md px-2 text-white/55',
                      highlighted && 'text-white'
                    )}
                  >
                    <span className='select-none text-right text-white/20'>
                      {index + 1}
                    </span>
                    <span className='pl-4'>
                      {line || '\u00A0'}
                    </span>
                  </motion.span>
                )
              })}
            </code>
          </pre>
        </div>

        <div className='flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5'>
          <div className='relative grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-2'>
            <div
              aria-hidden='true'
              className='absolute top-[1.35rem] right-[12.5%] left-[12.5%] hidden h-px bg-white/10 lg:block'
            >
              <motion.span
                data-codex-signal-motion
                className='block h-px origin-left bg-gradient-to-r from-amber-300 via-orange-400 to-emerald-300 shadow-[0_0_12px_rgba(251,191,36,0.7)]'
                initial={false}
                animate={{
                  scaleX: reduceMotion
                    ? 1
                    : (activeStep + 0.15) / CODEX_MOTION_STEPS.length,
                }}
                transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>

            {CODEX_MOTION_STEPS.map((motionStep, index) => {
              const Icon = STEP_ICONS[index]
              const isActive = activeStep === index
              const isComplete = activeStep > index
              let nodeStateClass =
                'border-white/10 bg-[#101114] text-white/45 group-hover:border-white/20 group-hover:text-white/75'

              if (isActive) {
                nodeStateClass =
                  'border-amber-300/55 bg-amber-300 text-black shadow-[0_10px_32px_-12px_rgba(251,191,36,0.9)]'
              } else if (isComplete) {
                nodeStateClass =
                  'border-emerald-300/25 bg-emerald-300/10 text-emerald-300'
              }

              return (
                <button
                  key={motionStep.id}
                  type='button'
                  data-codex-step={motionStep.id}
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => selectStep(index)}
                  className='group relative z-10 flex min-w-0 flex-col items-center rounded-xl px-1 py-1 text-center focus-visible:outline-none'
                >
                  <motion.span
                    data-codex-step-node
                    initial={false}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            scale: isActive ? 1.06 : 1,
                          }
                    }
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    className={cn(
                      'relative flex size-11 items-center justify-center rounded-xl border transition-colors duration-300 group-focus-visible:ring-2 group-focus-visible:ring-amber-300/70 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#101114]',
                      nodeStateClass
                    )}
                  >
                    <Icon className='size-4.5' aria-hidden='true' />
                  </motion.span>
                  <span
                    className={cn(
                      'mt-2 truncate text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors',
                      isActive ? 'text-amber-200' : 'text-white/35'
                    )}
                  >
                    {t(motionStep.labelKey)}
                  </span>
                </button>
              )
            })}
          </div>

          <div className='mt-5 flex flex-1 items-center'>
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={step.id}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: -6, filter: 'blur(3px)' }
                }
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                className='w-full rounded-2xl border border-white/8 bg-black/25 p-5'
              >
                <div className='flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-amber-300 uppercase'>
                  <span>{String(activeStep + 1).padStart(2, '0')}</span>
                  <span aria-hidden='true' className='h-px w-7 bg-amber-300/35' />
                  <span>{t(step.labelKey)}</span>
                </div>
                <h3 className='mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl'>
                  {t(step.titleKey)}
                </h3>
                <p className='mt-2 max-w-md text-sm leading-6 text-white/55'>
                  {t(step.descriptionKey)}
                </p>

                <div className='mt-5 flex min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-white/8 bg-black/35 px-3 py-3 font-mono text-[10px] text-white/45 sm:text-xs'>
                  <span
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      activeStep === CODEX_MOTION_STEPS.length - 1
                        ? 'bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]'
                        : 'bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.65)]'
                    )}
                    aria-hidden='true'
                  />
                  <span className='truncate'>
                    {activeStep === 0 && '~/.codex/config.toml'}
                    {activeStep === 1 && 'SHAREAPI_API_KEY=••••••••'}
                    {activeStep === 2 && 'llm.shareapi.ai/v1/responses'}
                    {activeStep === 3 && 'gpt-5.6 · custom · ready'}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className='sr-only' aria-live='polite'>
        {t(step.titleKey)}. {t(step.descriptionKey)}
      </p>
    </section>
  )
}
