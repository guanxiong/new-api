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
import { ArrowDown, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const MODEL_SWITCH_HASH = '#switch-model'

const MODEL_OPTIONS = [
  {
    id: 'gpt-5.6-sol',
    label: 'Sol',
    descriptionKey: 'codexGuide.modelSwitch.solDescription',
    active: false,
  },
  {
    id: 'gpt-5.6-terra',
    label: 'Terra',
    descriptionKey: 'codexGuide.modelSwitch.terraDescription',
    active: false,
  },
  {
    id: 'gpt-5.6-luna',
    label: 'Luna',
    descriptionKey: 'codexGuide.modelSwitch.lunaDescription',
    active: true,
  },
] as const

export function ModelSwitchGuide() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.location.hash !== MODEL_SWITCH_HASH) return

    const animationFrame = window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ block: 'start' })
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <section
      ref={sectionRef}
      id='switch-model'
      aria-labelledby='switch-model-title'
      className='scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8'
    >
      <div className='mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-sky-300/15 bg-[radial-gradient(circle_at_78%_0%,rgba(125,211,252,0.13),transparent_38%),#0b0c10]'>
        <div className='grid gap-10 p-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:p-12'>
          <div>
            <p className='font-mono text-[10px] tracking-[0.18em] text-sky-300 uppercase'>
              {t('codexGuide.modelSwitch.eyebrow')}
            </p>
            <h2
              id='switch-model-title'
              className='mt-4 text-3xl font-semibold tracking-tight sm:text-4xl'
            >
              {t('codexGuide.modelSwitch.title')}
            </h2>
            <p className='mt-4 max-w-xl text-sm leading-7 text-white/55'>
              {t('codexGuide.modelSwitch.description')}
            </p>

            <div className='mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3'>
              <div className='min-w-0 rounded-xl border border-white/9 bg-black/30 p-4'>
                <p className='font-mono text-[9px] tracking-[0.14em] text-white/35 uppercase'>
                  {t('codexGuide.modelSwitch.before')}
                </p>
                <code className='mt-2 block overflow-x-auto font-mono text-xs text-white/55 sm:text-sm'>
                  model = &quot;gpt-5.6&quot;
                </code>
              </div>
              <ArrowDown
                className='size-4 -rotate-90 text-sky-300'
                aria-hidden='true'
              />
              <div className='min-w-0 rounded-xl border border-sky-300/25 bg-sky-300/[0.07] p-4'>
                <p className='font-mono text-[9px] tracking-[0.14em] text-sky-200 uppercase'>
                  {t('codexGuide.modelSwitch.after')}
                </p>
                <code className='mt-2 block overflow-x-auto font-mono text-xs text-sky-100 sm:text-sm'>
                  model = &quot;gpt-5.6-luna&quot;
                </code>
              </div>
            </div>

            <p className='mt-4 text-xs leading-5 text-amber-200/75'>
              {t('codexGuide.modelSwitch.aliasNote')}
            </p>
          </div>

          <div>
            <div className='grid gap-3 sm:grid-cols-3'>
              {MODEL_OPTIONS.map((model) => (
                <article
                  key={model.id}
                  className={`rounded-2xl border p-4 ${model.active ? 'border-sky-300/30 bg-sky-300/[0.07]' : 'border-white/9 bg-black/25'}`}
                >
                  <div className='flex items-center justify-between gap-3'>
                    <h3 className='text-sm font-semibold text-white'>
                      {model.label}
                    </h3>
                    {model.active ? (
                      <span className='rounded-full bg-sky-300/12 px-2 py-1 font-mono text-[9px] tracking-wide text-sky-200 uppercase'>
                        {t('codexGuide.modelSwitch.target')}
                      </span>
                    ) : null}
                  </div>
                  <code className='mt-3 block font-mono text-[11px] text-white/65'>
                    {model.id}
                  </code>
                  <p className='mt-3 text-xs leading-5 text-white/40'>
                    {t(model.descriptionKey)}
                  </p>
                </article>
              ))}
            </div>

            <ol className='mt-5 grid gap-3'>
              {[
                {
                  icon: Sparkles,
                  title: t('codexGuide.modelSwitch.editTitle'),
                  description: t('codexGuide.modelSwitch.editDescription'),
                },
                {
                  icon: RefreshCw,
                  title: t('codexGuide.modelSwitch.restartTitle'),
                  description: t('codexGuide.modelSwitch.restartDescription'),
                },
                {
                  icon: CheckCircle2,
                  title: t('codexGuide.modelSwitch.newTaskTitle'),
                  description: t('codexGuide.modelSwitch.newTaskDescription'),
                },
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <li
                    key={step.title}
                    className='flex gap-4 rounded-xl border border-white/8 bg-black/20 p-4'
                  >
                    <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sky-300'>
                      <Icon className='size-4' aria-hidden='true' />
                    </span>
                    <div>
                      <h3 className='text-sm font-medium text-white'>
                        {index + 1}. {step.title}
                      </h3>
                      <p className='mt-1 text-xs leading-5 text-white/45'>
                        {step.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
