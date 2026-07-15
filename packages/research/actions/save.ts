import type { SaveState } from '@/types/research-actions'

/** Events that drive the save lifecycle. */
export type SaveEvent = 'save' | 'success' | 'failure' | 'dirty' | 'retry'

/**
 * Deterministic save state machine. Modelling save/bookmark transitions as a
 * pure reducer keeps optimistic UI honest and makes edge cases (e.g. editing
 * while a save is in flight) testable without React.
 */
export function saveReducer(state: SaveState, event: SaveEvent): SaveState {
  switch (event) {
    case 'save':
    case 'retry':
      // Kicking off a save is valid from any state except while already saving.
      return state === 'saving' ? 'saving' : 'saving'
    case 'success':
      // Only a save in flight can succeed.
      return state === 'saving' ? 'saved' : state
    case 'failure':
      return state === 'saving' ? 'error' : state
    case 'dirty':
      // Local edits invalidate a previously saved/errored state.
      if (state === 'saved' || state === 'error') return 'unsaved'
      return state
    default:
      return state
  }
}

/** Whether a new save may be started from the current state. */
export function canSave(state: SaveState): boolean {
  return state !== 'saving'
}

/** Human-facing label for a save state. */
export function saveStateLabel(state: SaveState): string {
  switch (state) {
    case 'unsaved':
      return 'Save'
    case 'saving':
      return 'Saving…'
    case 'saved':
      return 'Saved'
    case 'error':
      return 'Retry save'
  }
}
