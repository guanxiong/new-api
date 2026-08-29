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

export const CODEX_PROVIDER_CONFIG = `model = "gpt-5.6"
model_provider = "shareapi"

[model_providers.shareapi]
name = "Share API"
base_url = "https://llm.shareapi.ai/v1"
wire_api = "responses"
env_key = "SHAREAPI_API_KEY"`

export const CODEX_DIRECT_TOKEN_CONFIG = `model = "gpt-5.6"
model_provider = "shareapi"

[model_providers.shareapi]
name = "Share API"
base_url = "https://llm.shareapi.ai/v1"
wire_api = "responses"
experimental_bearer_token = "<Share API Token>"`

export const CODEX_PROVIDER_CONFIG_LINES = CODEX_PROVIDER_CONFIG.split('\n')

export const CODEX_MOTION_STEPS = [
  {
    id: 'config',
    labelKey: 'codexGuide.motion.configLabel',
    titleKey: 'codexGuide.motion.configTitle',
    descriptionKey: 'codexGuide.motion.configDescription',
    highlightedLines: [0, 1, 3, 4],
  },
  {
    id: 'key',
    labelKey: 'codexGuide.motion.keyLabel',
    titleKey: 'codexGuide.motion.keyTitle',
    descriptionKey: 'codexGuide.motion.keyDescription',
    highlightedLines: [7],
  },
  {
    id: 'connect',
    labelKey: 'codexGuide.motion.connectLabel',
    titleKey: 'codexGuide.motion.connectTitle',
    descriptionKey: 'codexGuide.motion.connectDescription',
    highlightedLines: [5, 6],
  },
  {
    id: 'task',
    labelKey: 'codexGuide.motion.taskLabel',
    titleKey: 'codexGuide.motion.taskTitle',
    descriptionKey: 'codexGuide.motion.taskDescription',
    highlightedLines: [0],
  },
] as const

export type CodexMotionStep = (typeof CODEX_MOTION_STEPS)[number]
