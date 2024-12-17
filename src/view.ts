import { BorderRadius, parseBorderRadius } from './borderRadius'
import { createRectFromBoundingRect, getLayoutRect, Rect } from './rect'

type ViewElement = HTMLElement & { originalBorderRadius: string }

type CSSPosition =
  | 'static'
  | 'relative'
  | 'absolute'
  | 'fixed'
  | 'sticky'
  | 'inherit'
  | 'initial'
  | 'unset'

export interface View {
  el(): ViewElement
  id(): string
  setTransform(transform: Partial<Transform>): void
  clearTransform(): void
  currentTransform: () => Transform
  currentBorderRadius: () => BorderRadius
  originalBorderRadius: () => BorderRadius
  layoutRect(): Rect
  boundingRect(): Rect
  cssPosition(): CSSPosition
}

export type Transform = {
  translateX: number
  translateY: number
  scaleX: number
  scaleY: number
}

export function createView(el: HTMLElement, id: string): View {
  let element = el as ViewElement
  let currentTransform: Transform = {
    translateX: 0,
    translateY: 0,
    scaleX: 1,
    scaleY: 1
  }
  if (typeof element.originalBorderRadius === 'undefined') {
    element.originalBorderRadius = window.getComputedStyle(element).borderRadius
  }

  const thisView = {
    el: () => element,
    id: () => id,
    setTransform,
    clearTransform,
    currentTransform: () => currentTransform,
    originalBorderRadius: () => parseBorderRadius(element.originalBorderRadius),
    currentBorderRadius: () =>
      parseBorderRadius(window.getComputedStyle(element).borderRadius),
    layoutRect: () => getLayoutRect(element),
    boundingRect: () =>
      createRectFromBoundingRect(element.getBoundingClientRect()),
    cssPosition: () => window.getComputedStyle(element).position as CSSPosition
  }

  function setTransform(newTransform: Partial<Transform>) {
    currentTransform = { ...currentTransform, ...newTransform }
    renderTransform()
  }

  function clearTransform() {
    currentTransform = {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1
    }
    renderTransform()
  }

  function renderTransform() {
    const { translateX, translateY, scaleX, scaleY } = currentTransform
    if (translateX === 0 && translateY === 0 && scaleX === 1 && scaleY === 1) {
      element.style.transform = ''
    } else {
      element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
    }
  }

  return thisView
}
