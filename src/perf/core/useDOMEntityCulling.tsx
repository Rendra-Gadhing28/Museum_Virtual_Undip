/**
 * Museum Virtual Undip — DOM Entity Culling & Visibility Management
 *
 * Implements viewport-based visibility culling for DOM elements, cards,
 * modals, and charts using the native Intersection Observer API:
 * - Lazy rendering for components not yet visible in the viewport.
 * - Freezes/pauses CSS animations and intensive DOM computations when off-screen.
 * - Resumes rendering and animation automatically upon re-entering viewport.
 * - Configurable rootMargin & threshold to prevent visual flickering.
 * - Containment and intrinsic sizing to avoid layout shift (CLS).
 */

import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

export interface UseElementVisibilityOptions {
  /**
   * Margin around the root element. Defaults to '120px 0px 120px 0px'
   * to ensure assets and elements mount smoothly slightly before entering view.
   */
  rootMargin?: string
  /**
   * Percentage of target's visibility needed before triggering.
   * Defaults to 0.01 (triggers as soon as 1% is visible).
   */
  threshold?: number | number[]
  /**
   * If true, keeps element considered visible once it enters view the first time.
   */
  once?: boolean
  /**
   * Root element for intersection check. Defaults to null (viewport).
   */
  root?: Element | Document | null
  /**
   * Initial visibility state before observer measures.
   */
  initialVisibility?: boolean
  /**
   * Callback fired on visibility transition.
   */
  onVisibilityChange?: (visible: boolean) => void
}

export interface UseElementVisibilityResult<T extends HTMLElement = HTMLDivElement> {
  ref: React.RefObject<T | null>
  isVisible: boolean
  hasBeenVisible: boolean
}

/**
 * Reusable React Hook for detecting element visibility with IntersectionObserver.
 */
export function useElementVisibility<T extends HTMLElement = HTMLDivElement>({
  rootMargin = '120px 0px 120px 0px',
  threshold = 0.01,
  once = false,
  root = null,
  initialVisibility = false,
  onVisibilityChange,
}: UseElementVisibilityOptions = {}): UseElementVisibilityResult<T> {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(initialVisibility)
  const [hasBeenVisible, setHasBeenVisible] = useState(initialVisibility)
  const callbackRef = useRef(onVisibilityChange)

  useEffect(() => {
    callbackRef.current = onVisibilityChange
  }, [onVisibilityChange])

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      setHasBeenVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        const inView = entry.isIntersecting
        setIsVisible(inView)
        if (inView) {
          setHasBeenVisible(true)
          if (once) {
            observer.disconnect()
          }
        }
        callbackRef.current?.(inView)
      },
      {
        root,
        rootMargin,
        threshold,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [root, rootMargin, threshold, once])

  return { ref, isVisible, hasBeenVisible }
}

export interface DOMEntityCullerProps {
  children: ReactNode | ((state: { isVisible: boolean; hasBeenVisible: boolean }) => ReactNode)
  /**
   * Minimum height in px or string to prevent layout shift before mounting.
   */
  minHeight?: number | string
  /**
   * Class names to append.
   */
  className?: string
  /**
   * Extra inline styles.
   */
  style?: CSSProperties
  /**
   * If true, defers mounting children until element enters view for the first time.
   * Defaults to true.
   */
  lazyMount?: boolean
  /**
   * If true, unmounts heavy children when leaving viewport.
   * Defaults to false (keeps mounted once seen to preserve form/input states unless requested).
   */
  unmountWhenHidden?: boolean
  /**
   * Pauses CSS animations inside container when culled (off-screen).
   * Defaults to true.
   */
  pauseAnimationsWhenCulled?: boolean
  /**
   * Applies CSS `content-visibility: auto` to optimize browser layout tree.
   * Defaults to true.
   */
  contentVisibility?: boolean
  /**
   * Intersection observer rootMargin (e.g. '120px 0px 120px 0px').
   */
  rootMargin?: string
  /**
   * Intersection observer threshold.
   */
  threshold?: number | number[]
  /**
   * Keep visible once entered.
   */
  once?: boolean
  /**
   * HTML tag to render. Defaults to 'div'.
   */
  as?: React.ElementType
}

/**
 * DOMEntityCuller Component
 * Wraps DOM sections, cards, modals, and charts to apply:
 * 1. Lazy mounting (avoids executing expensive DOM subtrees upfront).
 * 2. Frustum / Viewport Culling (pauses animations when off-screen).
 * 3. Zero layout shifts using CSS min-height and intrinsic size.
 */
export function DOMEntityCuller({
  children,
  minHeight,
  className = '',
  style = {},
  lazyMount = true,
  unmountWhenHidden = false,
  pauseAnimationsWhenCulled = true,
  contentVisibility = true,
  rootMargin = '120px 0px 120px 0px',
  threshold = 0.01,
  once = false,
  as: Component = 'div',
}: DOMEntityCullerProps) {
  const { ref, isVisible, hasBeenVisible } = useElementVisibility<HTMLDivElement>({
    rootMargin,
    threshold,
    once,
  })

  const shouldRenderChildren = lazyMount
    ? unmountWhenHidden
      ? isVisible
      : hasBeenVisible
    : true

  const combinedStyles: CSSProperties = {
    ...style,
    minHeight: minHeight ?? style.minHeight,
    ...(contentVisibility ? { contentVisibility: 'auto' as const } : {}),
    ...(pauseAnimationsWhenCulled && !isVisible
      ? {
          animationPlayState: 'paused',
        }
      : {}),
  }

  const cullingClass = [
    className,
    'dom-entity-culler',
    !isVisible ? 'is-culled' : 'is-visible',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component
      ref={ref}
      className={cullingClass}
      style={combinedStyles}
      data-culled={!isVisible}
    >
      {shouldRenderChildren &&
        (typeof children === 'function'
          ? children({ isVisible, hasBeenVisible })
          : children)}
    </Component>
  )
}
