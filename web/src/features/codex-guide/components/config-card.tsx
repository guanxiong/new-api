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
  Check,
  Copy,
  FilePenLine,
  FolderOpen,
  LoaderCircle,
  Save,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type WritableConfigFile = {
  write: (contents: string) => Promise<void>
  close: () => Promise<void>
  abort?: () => Promise<void>
}

type ConfigFileHandle = {
  name: string
  getFile: () => Promise<File>
  createWritable: () => Promise<WritableConfigFile>
}

type OpenFilePickerOptions = {
  id?: string
  multiple?: boolean
  types?: Array<{
    description: string
    accept: Record<string, string[]>
  }>
}

type FilePickerWindow = Window & {
  showOpenFilePicker?: (
    options?: OpenFilePickerOptions
  ) => Promise<ConfigFileHandle[]>
}

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: {
    platform?: string
    brands?: Array<{ brand: string }>
  }
}

const MAX_CONFIG_FILE_SIZE = 1024 * 1024

function supportsMacConfigEditing() {
  const extendedNavigator = navigator as NavigatorWithUserAgentData
  const platform =
    extendedNavigator.userAgentData?.platform ?? navigator.platform
  const isMac = /mac/i.test(platform)
  const brands = extendedNavigator.userAgentData?.brands ?? []
  const isChromium =
    brands.some(({ brand }) =>
      /Chromium|Google Chrome|Microsoft Edge/i.test(brand)
    ) || /(?:Chrome|Chromium|Edg)\//i.test(navigator.userAgent)

  return (
    isMac &&
    isChromium &&
    typeof (window as FilePickerWindow).showOpenFilePicker === 'function'
  )
}

function isPickerCancellation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  )
}

function CopyCode({ text, label }: { text: string; label: string }) {
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

function useLocalConfigFileEditor(enabled: boolean) {
  const { t } = useTranslation()
  const [fileHandle, setFileHandle] = useState<ConfigFileHandle | null>(null)
  const [fileName, setFileName] = useState('')
  const [contents, setContents] = useState('')
  const [savedContents, setSavedContents] = useState('')
  const [isOpening, setIsOpening] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const isDirty = fileHandle !== null && contents !== savedContents
  const isSupported = enabled && supportsMacConfigEditing()

  const openFile = async () => {
    if (isDirty && !window.confirm(t('codexGuide.localEditor.discardPrompt'))) {
      return
    }

    setIsOpening(true)
    setHasError(false)
    setMessage(null)

    try {
      const picker = (window as FilePickerWindow).showOpenFilePicker
      if (!picker) {
        return
      }

      const [handle] = await picker.call(window, {
        id: 'shareapi-codex-config',
        multiple: false,
        types: [
          {
            description: 'TOML',
            accept: {
              'text/plain': ['.toml'],
            },
          },
        ],
      })

      if (!handle) {
        return
      }

      const file = await handle.getFile()
      if (file.name !== 'config.toml') {
        throw new Error('invalid-file-name')
      }
      if (file.size > MAX_CONFIG_FILE_SIZE) {
        throw new Error('file-too-large')
      }

      const nextContents = await file.text()
      setFileHandle(handle)
      setFileName(file.name)
      setContents(nextContents)
      setSavedContents(nextContents)
      setMessage(t('codexGuide.localEditor.opened'))
    } catch (error) {
      if (isPickerCancellation(error)) {
        return
      }

      let nextMessage = t('codexGuide.localEditor.openError')
      if (error instanceof Error && error.message === 'invalid-file-name') {
        nextMessage = t('codexGuide.localEditor.invalidFile')
      } else if (error instanceof Error && error.message === 'file-too-large') {
        nextMessage = t('codexGuide.localEditor.fileTooLarge')
      }
      setHasError(true)
      setMessage(nextMessage)
    } finally {
      setIsOpening(false)
    }
  }

  const saveFile = async () => {
    const handle = fileHandle
    if (!handle || !isDirty) {
      return
    }

    setIsSaving(true)
    setHasError(false)
    setMessage(null)
    let writable: WritableConfigFile | null = null

    try {
      writable = await handle.createWritable()
      await writable.write(contents)
      await writable.close()
      setSavedContents(contents)
      setMessage(t('codexGuide.localEditor.saved'))
    } catch {
      await writable?.abort?.().catch(() => undefined)
      setHasError(true)
      setMessage(t('codexGuide.localEditor.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  if (!isSupported) {
    return { openButton: null, editorPanel: null }
  }

  let editorPanel = null
  if (fileHandle) {
    editorPanel = (
      <div className='col-span-full border-t border-emerald-300/15 bg-emerald-300/[0.025] px-4 py-5 sm:px-5'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='flex min-w-0 items-start gap-3'>
            <span className='mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300'>
              <FilePenLine className='size-4' aria-hidden='true' />
            </span>
            <div className='min-w-0'>
              <label
                htmlFor='codex-local-config-editor'
                className='block truncate text-sm font-semibold text-white'
              >
                {fileName}
              </label>
              <p className='mt-1 text-xs leading-5 text-white/45'>
                {t('codexGuide.localEditor.pathHint')}
              </p>
            </div>
          </div>
          <div className='flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start'>
            <span className='inline-flex items-center gap-1.5 text-[11px] text-emerald-200/65'>
              <ShieldCheck className='size-3.5' aria-hidden='true' />
              {t('codexGuide.localEditor.localOnly')}
            </span>
            <Button
              type='button'
              size='sm'
              className='h-8 bg-emerald-300 px-3 text-xs font-semibold text-black hover:bg-emerald-200'
              disabled={!isDirty || isSaving}
              onClick={() => void saveFile()}
            >
              {isSaving ? (
                <LoaderCircle
                  className='animate-spin motion-reduce:animate-none'
                  aria-hidden='true'
                />
              ) : (
                <Save aria-hidden='true' />
              )}
              {isSaving
                ? t('codexGuide.localEditor.saving')
                : t('codexGuide.localEditor.saveButton')}
            </Button>
          </div>
        </div>

        <Textarea
          id='codex-local-config-editor'
          value={contents}
          onChange={(event) => {
            setContents(event.target.value)
            setMessage(null)
            setHasError(false)
          }}
          spellCheck={false}
          autoCapitalize='none'
          autoCorrect='off'
          className='mt-4 min-h-72 resize-y border-white/10 bg-[#07080a] p-4 font-mono text-xs leading-6 text-white/75 focus-visible:border-emerald-300/45 focus-visible:ring-emerald-300/20'
        />

        <div className='mt-3 flex flex-wrap items-center justify-between gap-2 text-xs'>
          <p className='text-white/35'>
            {t('codexGuide.localEditor.pickerHint')}
          </p>
          <p
            role='status'
            aria-live='polite'
            className={hasError ? 'text-red-300' : 'text-emerald-300'}
          >
            {message ?? (isDirty ? t('codexGuide.localEditor.unsaved') : '')}
          </p>
        </div>
      </div>
    )
  } else if (message) {
    editorPanel = (
      <p
        role='alert'
        className='col-span-full border-t border-red-300/15 px-4 py-3 text-xs text-red-300 sm:px-5'
      >
        {message}
      </p>
    )
  }

  return {
    openButton: (
      <Button
        type='button'
        size='sm'
        variant='outline'
        className='h-8 border-emerald-300/20 bg-emerald-300/[0.06] px-3 text-xs text-emerald-100 hover:bg-emerald-300/12 hover:text-white'
        disabled={isOpening}
        onClick={() => void openFile()}
      >
        {isOpening ? (
          <LoaderCircle
            className='animate-spin motion-reduce:animate-none'
            aria-hidden='true'
          />
        ) : (
          <FolderOpen aria-hidden='true' />
        )}
        {isOpening
          ? t('codexGuide.localEditor.opening')
          : t('codexGuide.localEditor.openButton')}
      </Button>
    ),
    editorPanel,
  }
}

export function ConfigCard({
  title,
  eyebrow,
  code,
  tone = 'recommended',
  allowLocalFileEditing = false,
}: {
  title: string
  eyebrow: string
  code: string
  tone?: 'recommended' | 'fallback'
  allowLocalFileEditing?: boolean
}) {
  const localEditor = useLocalConfigFileEditor(allowLocalFileEditing)

  return (
    <article className='grid overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c10]'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:flex-nowrap sm:px-5'>
        <div className='min-w-0 basis-full sm:flex-1 sm:basis-auto'>
          <p
            className={`font-mono text-[9px] tracking-[0.16em] uppercase ${tone === 'recommended' ? 'text-emerald-300' : 'text-amber-300'}`}
          >
            {eyebrow}
          </p>
          <h3 className='mt-1 truncate text-sm font-semibold text-white'>
            {title}
          </h3>
        </div>
        <div className='flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto'>
          {localEditor.openButton}
          <CopyCode text={code} label={title} />
        </div>
      </div>
      <pre className='overflow-x-auto px-5 py-5 font-mono text-[11px] leading-7 text-white/70 sm:text-xs'>
        <code>{code}</code>
      </pre>
      {localEditor.editorPanel}
    </article>
  )
}
