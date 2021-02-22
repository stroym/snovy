import useResizeObserver from "@react-hook/resize-observer"
import React, {Dispatch, SetStateAction, useEffect, useLayoutEffect, useReducer, useState} from "react"
import {Key} from "ts-key-enum"
import {isArray, isItem} from "./Utils"

export function useHideOnOutsideClick(elementRef: React.RefObject<Element | null>,
                                      otherRefs?: Array<React.RefObject<Element | null>>,
                                      initialState?: boolean):
  [boolean, Dispatch<SetStateAction<boolean>>, () => void] {

  const [visible, setVisible] = useState(initialState ?? false)

  const flip = () => {
    setVisible(!visible)
  }

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)
      document.addEventListener("keydown", handleKey)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
        document.removeEventListener("keydown", handleKey)
      }
    }, []
  )

  const handleOutsideClick = (e: MouseEvent) => {
    !elementRef.current?.contains(e.target as Node) &&
    !otherRefs?.find(it => it.current?.contains((e.target as Node))) &&
    setVisible(false)
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key == Key.Escape) {
      setVisible(false)
    }
  }

  return [visible, setVisible, flip]
}

export function useContextMenu(
  contextRef: React.RefObject<Element | null>,
  parentRef: React.RefObject<Element | null>,
  resetContext?: () => void
) {

  const [visible, setVisible] = useHideOnOutsideClick(contextRef)
  const {position, setX, setY} = useAbsolutePosition(contextRef, visible)

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
      if (!visible && resetContext) {
        resetContext()
      }
    }, [visible]
  )

  const handleContextMenu = (e: any) => {
    e.preventDefault()

    if (!contextRef.current?.contains(e.target as Node)) {
      const negate = !visible

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

export function useCollapse(elementRef: React.RefObject<Element | null>):
  [boolean, Dispatch<SetStateAction<boolean>>] {

  const [collapsed, setCollapsed] = useState(false)

  useEffect(
    () => {
      // elementRef.current!.style.transition = "opacity 600"
      elementRef.current!.classList.remove("snovy-hooks-collapsible")
    }, []
  )

  if (elementRef.current) {
    if (collapsed) {
      elementRef.current.classList.remove("snovy-hooks-rolling")
      elementRef.current.classList.add("snovy-hooks-unrolling")

      // elementRef.current.style.opacity = "0"
      // setTimeout(() => elementRef.current!.style.height = "0", 600)
    } else {
      elementRef.current.classList.remove("snovy-hooks-rolling")
      elementRef.current.classList.add("snovy-hooks-unrolling")

      // elementRef.current.style.height = "100%"
      // elementRef.current.style.opacity = "1"
    }
  }

  return [collapsed, setCollapsed]
}

export function useColored(str?: string, colorStr?: string):
  [string, string, React.Dispatch<React.SetStateAction<string>>, React.Dispatch<React.SetStateAction<string>>] {
  const [text, setText] = useState(str ?? "")
  const [color, setColor] = useState(colorStr ?? "#ffffff")

  return [text, color, setText, setColor]
}

export function useMultiSelect<T>(listItems: Array<T> | undefined) {

  const [ctrlMode, setCtrlMode] = useState(false)
  const [shiftMode, setShiftMode] = useState(false)

  const [selectedItems, setSelectedItems] = useState<Array<T>>([])

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
      if (listItems) {
        if (selectedItems.includes(item)) {
          setSelectedItems(listItems.slice(listItems.indexOf(selectedItems.first()!), listItems.indexOf(item) + 1))
        } else {
          const indiFirst = listItems.indexOf(selectedItems.first()!)
          const indiItem = listItems.indexOf(item)

          if (indiItem > indiFirst) {
            setSelectedItems(listItems.slice(indiFirst, indiItem + 1))
          } else {
            setSelectedItems(listItems.slice(indiItem, indiFirst + 1).reverse())
          }
        }
      }
    } else {
      setSelectedItems([item])
    }
  }

  return {shiftMode, ctrlMode, selectedItems, setSelectedItems, handleItemClick}
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