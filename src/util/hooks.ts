import useResizeObserver from "@react-hook/resize-observer"
import React, {Dispatch, SetStateAction, useEffect, useLayoutEffect, useReducer, useState} from "react"
import {Key} from "ts-key-enum"
import {isArray, isItem} from "./utils"

type mouseEventType = "mousedown" | "click"

export function watchOutsideClick(
  elementRef: React.RefObject<Element | null>,
  {otherRefs = [], eventType = "mousedown", initialState = false, onToggleOff = () => false}: {
    otherRefs?: Array<React.RefObject<Element | null>>,
    eventType?: mouseEventType,
    initialState?: boolean,
    onToggleOff?: () => void
  } = {}
):
  [boolean, Dispatch<SetStateAction<boolean>>, () => void] {

  const [toggled, setToggled, toggle] = useToggle(initialState)

  useEffect(
    () => {
      document.addEventListener(eventType, handleOutsideClick)
      document.addEventListener("keydown", handleKey)

      return () => {
        document.removeEventListener(eventType, handleOutsideClick)
        document.removeEventListener("keydown", handleKey)
      }
    }, []
  )

  const toggleOff = () => {
    setToggled(false)
    onToggleOff && onToggleOff()
  }

  const handleOutsideClick = (e: MouseEvent) => {
    if (!elementRef.current?.contains(e.target as Node) && !otherRefs?.find(it => it.current?.contains((e.target as Node)))) {
      toggleOff()
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key == Key.Escape) {
      toggleOff()
    }
  }

  return [toggled, setToggled, toggle]
}

export function useContextMenu(contextRef: React.RefObject<Element | null>, parentRef: React.RefObject<Element | null>) {
  const [visible, setVisible] = watchOutsideClick(contextRef)
  const {position, setX, setY} = useAbsolutePosition(contextRef, visible)

  const [, setContextItem] = useReducer(
    (prevState: HTMLElement | null, newState: HTMLElement | null): HTMLElement | null => {
      prevState?.setAttribute("data-context", "false")
      newState?.setAttribute("data-context", "true")

      return newState
    },
    null
  )

  useEffect(
    () => {
      parentRef.current?.addEventListener("contextmenu", handleContextMenu)

      return () => {
        parentRef.current?.removeEventListener("contextmenu", handleContextMenu)
      }
    }, []
  )

  useEffect(
    () => {
      if (!visible) {
        setContextItem(null)
      }
    }, [visible]
  )

  const handleContextMenu = e => {
    e.preventDefault()

    if (!contextRef.current?.contains(e.target)) {
      const negate = !visible

      if (parentRef.current != e.target && parentRef.current?.contains(e.target)) {
        setContextItem(e.target)
      }

      if (negate) {
        setX(e.pageX)
        setY(e.pageY)
      }

      setVisible(negate)
    } else {
      e.stopPropagation()
    }
  }

  return {visible, setVisible, position}
}

export function useDefaultEmpty<T>(array?: Array<T> | T | null | undefined) {
  return useReducer(
    (prevState: Array<T>, newState: Array<T> | T | null | undefined): Array<T> => {
      return isArray(newState) ? newState : isItem(newState) ? [newState] : []
    },
    isArray(array) ? array : isItem(array) ? [array] : []
  )
}

export function useMultiSelect<T>(listItems: Array<T>) {

  const [ctrlMode, setCtrlMode] = useState(false)
  const [shiftMode, setShiftMode] = useState(false)

  const [selectedItems, setSelectedItems] = useReducer(
    (prevState: Array<T>, newState: Array<T>): Array<T> => {
      if (listItems.includesAll(newState)) {
        return newState
      } else {
        return prevState
      }
    },
    []
  )

  useEffect(
    () => {
      document.addEventListener("mousemove", handleKey)

      return () => {
        document.removeEventListener("mousemove", handleKey)
      }
    }, []
  )

  const handleKey = (e: MouseEvent) => {
    setShiftMode(e.shiftKey)
    setCtrlMode(e.ctrlKey)
  }

  const handleItemClick = (item: T) => {
    if (ctrlMode) {
      if (selectedItems.includes(item)) {
        if (selectedItems.length > 1) {
          setSelectedItems(Array.from(selectedItems).remove(item))
        }
      } else {
        setSelectedItems(selectedItems.concat(item))
      }
    } else if (shiftMode) {
      if (selectedItems.includes(item)) {
        setSelectedItems(listItems.slice(listItems.indexOf(selectedItems.first()!), listItems.indexOf(item) + 1))
      } else {
        const firstIndex = listItems.indexOf(selectedItems.first()!)
        const itemIndex = listItems.indexOf(item)

        if (itemIndex > firstIndex) {
          setSelectedItems(listItems.slice(firstIndex, itemIndex + 1))
        } else {
          setSelectedItems(listItems.slice(itemIndex, firstIndex + 1).reverse())
        }
      }
    } else {
      setSelectedItems([item])
    }
  }

  const resetSelection = () => {
    selectedItems.first() && setSelectedItems([selectedItems.first()!])
  }

  return {
    shiftMode,
    ctrlMode,
    selectedItems,
    setSelectedItems,
    activeItem: selectedItems.first(),
    handleItemClick,
    resetSelection
  }
}

export function useSize(elementRef: React.RefObject<Element | null>, visible: boolean) {

  const [size, setSize] = useState<DOMRect>()

  useLayoutEffect(
    () => {
      setSize(elementRef.current?.getBoundingClientRect())
    }, [elementRef, visible]
  )

  useResizeObserver(elementRef?.current as HTMLElement, (entry) => setSize(entry.target.getBoundingClientRect()))

  return size
}

export function useAbsolutePosition(elementRef: React.RefObject<Element | null>, visible: boolean) {

  const size = useSize(elementRef, visible)

  const [x, setX] = useState(size?.left ?? 0)
  const [y, setY] = useState(size?.top ?? 0)

  const [top, setTop] = useState("unset")
  const [left, setLeft] = useState("unset")

  useEffect(
    () => {
      if (size) {
        if (y > (window.innerHeight - size.height * 1.1)) {
          setTop(y - size.height + "px")
        } else {
          setTop(y + "px")
        }

        if (x > (window.innerWidth - size.width * 1.1)) {
          setLeft(x - size.width + "px")
        } else {
          setLeft(x + "px")
        }
      }
    }, [size]
  )

  const position: React.CSSProperties = {
    position: "absolute",
    top: top,
    left: left
  }

  return {position, setX, setY}
}

export function useRelativePosition(elementRef: React.RefObject<Element | null>, visible: boolean) {

  const [top, setTop] = useState("unset")
  const [right, setRight] = useState("unset")
  const [bottom, setBottom] = useState("unset")
  const [left, setLeft] = useState("unset")

  const size = useSize(elementRef, visible)

  useEffect(
    () => {
      if (size) {
        if (size.top > (window.innerHeight - size.height * 1.1)) {
          setTop("unset")
          setBottom("-1px")
        } else {
          setTop("-1px")
          setBottom("unset")
        }

        if (size.left > (window.innerWidth - size.width * 1.1)) {
          setRight("100%")
          setLeft("unset")
        } else {
          setRight("unset")
          setLeft("100%")
        }
      }
    }, [size]
  )

  const position: React.CSSProperties = {
    position: "absolute",
    top: top,
    right: right,
    bottom: bottom,
    left: left
  }

  return position
}

//TODO move onToggleOff here, use reducer, probably
export function useToggle(initialState?: boolean): [boolean, Dispatch<SetStateAction<boolean>>, () => void] {
  const [toggled, setToggled] = useState(initialState ?? false)

  const toggle = () => {
    setToggled(!toggled)
  }

  return [toggled, setToggled, toggle]
}

//TODO useNavigation - arrow keys moving in lists and things