'use client'
import type { RefObject } from 'react'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

type UseClickableCardType<T extends HTMLElement> = {
  card: {
    ref: RefObject<T | null>
  }
  link: {
    ref: RefObject<HTMLAnchorElement | null>
  }
}

interface Props {
  external?: boolean
  newTab?: boolean
  scroll?: boolean
}

function useClickableCard<T extends HTMLElement>({
  external = false,
  newTab = false,
  scroll = true,
}: Props): UseClickableCardType<T> {
  const router = useRouter()
  const card = useRef<T>(null)
  const link = useRef<HTMLAnchorElement>(null)
  const timeDown = useRef<number>(0)
  const hasActiveParent = useRef<boolean>(false)
  const pressedButton = useRef<number>(0)

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as Element | null
    if (!target) return

    const timeNow = +new Date()
    const parent = target.closest('a')

    pressedButton.current = e.button

    if (!parent) {
      hasActiveParent.current = false
      timeDown.current = timeNow
    } else {
      hasActiveParent.current = true
    }
  }, [])

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      const href = link.current?.href
      if (!href) return

      const timeNow = +new Date()
      const difference = timeNow - timeDown.current

      if (difference > 250) return
      if (hasActiveParent.current || pressedButton.current !== 0 || e.ctrlKey || e.metaKey) return

      if (external) {
        const target = newTab ? '_blank' : '_self'
        window.open(href, target)
      } else {
        router.push(href, { scroll })
      }
    },
    [router, external, newTab, scroll],
  )

  useEffect(() => {
    const cardNode = card.current
    if (!cardNode) return

    const abortController = new AbortController()

    cardNode.addEventListener('mousedown', handleMouseDown, {
      signal: abortController.signal,
    })
    cardNode.addEventListener('mouseup', handleMouseUp, {
      signal: abortController.signal,
    })

    return () => {
      abortController.abort()
    }
  }, [handleMouseDown, handleMouseUp])

  return {
    card: {
      ref: card,
    },
    link: {
      ref: link,
    },
  }
}

export default useClickableCard
