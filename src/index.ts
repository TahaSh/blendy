import { animate, AnimateConfig, CancelFunction } from './animators'
import {
  borderRadiusToString,
  calculateBorderRadiusInverse
} from './borderRadius'
import { easeOutBack, easeOutCubic } from './easings'
import { lerp } from './math'
import { vec2 } from './vector'
import { createView, View } from './view'

export interface Blendy {
  toggle(id: string, onDone?: OnDoneCallback): void
  untoggle(id: string, onDone?: OnDoneCallback): void
  update(): void
}

export type AnimationType = 'dynamic' | 'spring'

type Config = {
  animation: AnimationType
}

interface Store {
  sourceViewById(id: string): View | undefined
  isToggled(id: string): boolean
  toggle(id: string, targetView: View): void
  untoggle(id: string): void
  targetView(id: string): View | null | undefined
  cancelAnimation(): CancelAnimation
  config(): Config
  syncSourceViews(sourceViews: View[]): void
}

type CancelAnimation = { blendy: CancelFunction | null }

type OnDoneCallback = () => void

function createStore({
  sourceViews,
  config
}: {
  sourceViews: Array<View>
  config: Config
}): Store {
  const initialStore = {
    config,
    sourceViews,
    toggleStatus: new Map() as Map<string, boolean>,
    targetViews: new Map() as Map<string, View | null>,
    cancelAnimation: {
      blendy: null
    } as CancelAnimation
  }
  const store = { ...initialStore }

  function syncSourceViews(sourceViews: View[]) {
    const currentViewIds = store.sourceViews.map(({ id }) => id())
    const newSourceViews = sourceViews.filter(
      (view) => !currentViewIds.includes(view.id())
    )
    store.sourceViews.push(...newSourceViews)
    newSourceViews.forEach((view) => {
      store.toggleStatus.set(view.id(), false)
      store.targetViews.set(view.id(), null)
    })
  }

  return {
    sourceViewById: (id: string) =>
      store.sourceViews.find((view) => id === view.id()),
    isToggled: (id: string) => store.toggleStatus.get(id) || false,
    toggle: (id: string, targetView: View) => {
      store.toggleStatus.set(id, true), store.targetViews.set(id, targetView)
    },
    untoggle: (id: string) => {
      store.toggleStatus.set(id, false)
      store.targetViews.set(id, null)
    },
    targetView: (id: string) => store.targetViews.get(id),
    cancelAnimation: () => store.cancelAnimation,
    config: () => config,
    syncSourceViews
  }
}

const DEFAULT_CONFIG: Config = {
  animation: 'dynamic'
}

function getAnimateConfig(animationType: AnimationType): AnimateConfig {
  switch (animationType) {
    case 'dynamic':
      return { easing: easeOutCubic, duration: 450 }
    case 'spring':
      return { easing: easeOutBack, duration: 400 }
  }
}

export function createBlendy(config?: Partial<Config>): Blendy {
  const userConfig = { ...DEFAULT_CONFIG, ...config }
  let sourceViews: View[] = []
  const store = createStore({ sourceViews: [], config: userConfig })

  requestAnimationFrame(init)

  function init() {
    sourceViews = Array.from(
      document.querySelectorAll('[data-blendy-from]')
    ).map((el) => {
      const element = el as HTMLElement
      return createView(element, element.dataset.blendyFrom!)
    })
    store.syncSourceViews(sourceViews)
  }

  function toggle(id: string, onDone?: OnDoneCallback) {
    if (store.isToggled(id)) return
    requestAnimationFrame(() => {
      const sourceView = store.sourceViewById(id)
      const targetElement = document.querySelector(
        `[data-blendy-to=${id}]`
      ) as HTMLElement
      if (targetElement) {
        const targetView = createView(targetElement, id)
        store.toggle(id, targetView)
        transitionViews(sourceView!, targetView, store, onDone)
      }
    })
  }

  function untoggle(id: string, onDone?: OnDoneCallback) {
    if (!store.isToggled(id)) return
    requestAnimationFrame(() => {
      const sourceView = store.sourceViewById(id)
      const targetView = store.targetView(id)
      if (sourceView) {
        transitionViews(targetView!, sourceView, store, onDone)
        store.untoggle(id)
      }
    })
  }

  function update(): void {
    requestAnimationFrame(() => {
      init()
    })
  }

  return {
    toggle,
    untoggle,
    update
  }
}

function transitionViews(
  sourceView: View,
  targetView: View,
  store: Store,
  onDone?: OnDoneCallback
) {
  store.cancelAnimation().blendy?.()
  const sourceRect = sourceView.boundingRect()
  const targetRect = targetView.boundingRect()

  const sourceChild = sourceView.el().children[0] as HTMLElement
  const targetChild = targetView.el().children[0] as HTMLElement
  const isSourceChildInline = getComputedStyle(sourceChild).display === 'inline'
  const isTargetChildInline = getComputedStyle(targetChild).display === 'inline'

  const dx = targetRect.x - sourceRect.x
  const dy = targetRect.y - sourceRect.y
  const sx = targetRect.width / sourceRect.width
  const sy = targetRect.height / sourceRect.height

  const targetZindex = targetView.el().style.zIndex || '0'

  requestAnimationFrame(() => {
    targetView.el().style.opacity = '1'
    sourceView.el().style.opacity = '1'
    targetView.el().style.pointerEvents = ''
    sourceView.el().style.pointerEvents = 'none'
    if (isSourceChildInline) {
      sourceChild.style.display = 'block'
    }
    if (isTargetChildInline) {
      targetChild.style.display = 'block'
    }
    targetView.el().style.overflow = 'hidden'
    sourceView.el().style.overflow = 'hidden'
  })

  targetView.el().style.transformOrigin = '0 0'
  sourceView.el().style.transformOrigin = '0 0'

  if (sourceView.cssPosition() === 'static') {
    sourceView.el().style.position = 'relative'
  }

  if (targetView.cssPosition() === 'static') {
    targetView.el().style.position = 'relative'
  }

  targetView.setTransform({
    translateX: -dx,
    translateY: -dy,
    scaleX: 1 / sx,
    scaleY: 1 / sy
  })

  targetView.el().style.borderRadius = borderRadiusToString(
    calculateBorderRadiusInverse(
      sourceView.originalBorderRadius(),
      1 / sx,
      1 / sy
    )
  )

  sourceView.el().style.zIndex = `${Number(targetZindex + 1000)}`

  store.cancelAnimation().blendy = animate(
    {
      translate: vec2(0, 0),
      scale: vec2(1, 1),
      borderRadius: sourceView.originalBorderRadius()
    },
    {
      translate: vec2(dx, dy),
      scale: vec2(sx, sy),
      borderRadius: targetView.originalBorderRadius()
    },
    ({ translate, scale, borderRadius }, done, progress) => {
      sourceView.setTransform({
        translateX: translate.x,
        translateY: translate.y,
        scaleX: scale.x,
        scaleY: scale.y
      })

      sourceView.el().style.borderRadius = borderRadiusToString(
        calculateBorderRadiusInverse(borderRadius, scale.x, scale.y)
      )

      sourceView.el().style.opacity = `${lerp(1, 0, progress * 6)}`

      sourceChild.style.transform = `scale(${1 / scale.x}, ${1 / scale.y})`

      targetView.setTransform({
        translateX: translate.x - dx,
        translateY: translate.y - dy,
        scaleX: scale.x / sx,
        scaleY: scale.y / sy
      })

      targetChild.style.transform = `scale(${sx / scale.x}, ${sy / scale.y})`

      targetView.el().style.borderRadius = borderRadiusToString(
        calculateBorderRadiusInverse(borderRadius, scale.x / sx, scale.y / sy)
      )

      if (done) {
        sourceChild.style.display = ''
        targetChild.style.display = ''
        sourceChild.style.transform = ''
        targetChild.style.transform = ''
        targetView.el().style.overflow = ''
        sourceView.el().style.overflow = ''
        targetView.el().style.position = ''
        sourceView.el().style.position = ''
        targetView.el().style.zIndex = ''
        sourceView.el().style.zIndex = ''
        targetView.el().style.opacity = ''
        sourceView.el().style.opacity = '0'
        sourceView.el().style.pointerEvents = 'none'
        sourceView.clearTransform()
        targetView.clearTransform()
        sourceView.el().style.transformOrigin = ''
        targetView.el().style.transformOrigin = ''
        sourceView.el().style.borderRadius = ''
        targetView.el().style.borderRadius = ''
        onDone?.()
      }
    },
    getAnimateConfig(store.config().animation)
  )
}
