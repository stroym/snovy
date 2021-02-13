import React, {Dispatch, SetStateAction, useEffect, useReducer, useState} from "react"
import {Key} from "ts-key-enum"
import {isArray, isItem} from "./Utils"

export function useHideOnOutsideClick(elementRef: React.RefObject<Element | undefined>,
                                      otherRefs?: Array<React.RefObject<Element | undefined>>,
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

export function useHide(elementRef: React.RefObject<Element | undefined>,
                        otherRefs?: Array<React.RefObject<Element | undefined>>,
                        initialState?: boolean) {
  const [visible, setVisible, flip] = useHideOnOutsideClick(elementRef, otherRefs, initialState)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const position: React.CSSProperties = {
    position: "absolute",
    top: y + "px",
    left: x + "px"
  }

  const handleClick = (e: React.MouseEvent) => {
    const negate = !visible

    if (negate) {
      setX(e.pageX)
      setY(e.pageY)
    }

    setVisible(negate)
  }

  return {visible, x, y, position, setVisible, setX, setY, handleClick, flip}
}

export function useContextMenu(
  elementRef: React.RefObject<Element | undefined>,
  parentRef: React.RefObject<Element | undefined>,
  resetContext?: () => void
) {
  const {visible, position, handleClick, flip} = useHide(elementRef)

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

    if (!elementRef.current?.contains(e.target as Node)) {
      handleClick(e)
    } else {
      e.stopPropagation()
    }
  }

  return {visible, flip, position}
}

export function useDefaultEmpty<T>(array?: Array<T> | T | null | undefined) {
  return useReducer(
    (prevState: Array<T>, newState: Array<T> | T | null | undefined): Array<T> => {
      return isArray(newState) ? newState : isItem(newState) ? [newState] : []
    },
    isArray(array) ? array : isItem(array) ? [array] : []
  )
}

export function useCollapse(elementRef: React.RefObject<HTMLElement | undefined>):
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