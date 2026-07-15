import type {
  ResearchActionAvailability,
  ResearchActionContext,
  ResearchActionId,
} from '@/types/research-actions'

const ALL_ACTIONS: ResearchActionId[] = [
  'continue',
  'followup',
  'save',
  'bookmark',
  'share',
  'export',
  'create_lead',
  'monitor',
  'create_workflow',
]

/** Actions that require a selected entity to be meaningful. */
const ENTITY_ACTIONS = new Set<ResearchActionId>(['create_lead', 'monitor'])

/** Actions that only make sense once research has produced output. */
const REQUIRES_OUTPUT = new Set<ResearchActionId>([
  'save',
  'bookmark',
  'share',
  'export',
  'create_lead',
  'monitor',
  'create_workflow',
])

/**
 * Pure, deterministic computation of which actions should be shown and enabled
 * for a given context. Keeping this outside React makes the permission logic
 * trivially testable and consistent between the toolbar and any menus.
 */
export function computeActionAvailability(
  context: ResearchActionContext,
): ResearchActionAvailability[] {
  const { completed, reviewMode, selectedEntity, canEdit, canShare } = context
  const hasOutput = completed || reviewMode

  return ALL_ACTIONS.map((id): ResearchActionAvailability => {
    let visible = true
    let enabled = true
    let disabledReason: string | undefined

    if (ENTITY_ACTIONS.has(id)) {
      // Entity actions are only visible when an entity is selected.
      visible = Boolean(selectedEntity)
    }

    if (REQUIRES_OUTPUT.has(id) && !hasOutput) {
      enabled = false
      disabledReason = 'Available once research completes'
    }

    if (id === 'share') {
      if (!canShare) {
        enabled = false
        disabledReason = 'You do not have permission to share'
      }
    }

    if ((id === 'save' || id === 'create_workflow' || id === 'create_lead') && !canEdit) {
      enabled = false
      disabledReason = 'You do not have edit permission'
    }

    return { id, visible, enabled, disabledReason }
  })
}

/** Convenience: only the actions that should render. */
export function visibleActions(
  context: ResearchActionContext,
): ResearchActionAvailability[] {
  return computeActionAvailability(context).filter((a) => a.visible)
}

/** Look up a single action's availability. */
export function actionAvailability(
  context: ResearchActionContext,
  id: ResearchActionId,
): ResearchActionAvailability {
  return (
    computeActionAvailability(context).find((a) => a.id === id) ?? {
      id,
      visible: false,
      enabled: false,
      disabledReason: 'Unknown action',
    }
  )
}
