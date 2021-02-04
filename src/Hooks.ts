import React, {Dispatch, SetStateAction, useEffect, useState} from "react"

export function useHideOnOutsideClick(elementRef: React.RefObject<Element | undefined>, initialState?: boolean):
  [boolean, Dispatch<SetStateAction<boolean>>, () => void] {

  const [visible, setVisible] = useState(initialState ?? false)

  const flip = () => {
    setVisible(!visible)
  }

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
      }
    }, []
  )

  const handleOutsideClick = (e: any) => {
    if (!elementRef.current?.contains(e.target)) {
      setVisible(false)
    }
  }

  return [visible, setVisible, flip]
}

export function useHide(elementRef: React.RefObject<Element | undefined>, initialState?: boolean) {

  const [visible, setVisible, flip] = useHideOnOutsideClick(elementRef, initialState)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const handleClick = (e: React.MouseEvent) => {
    const negate = !visible

    if (negate) {
      setX(e.pageX)
      setY(e.pageY)
    }

    setVisible(negate)
  }

  return {visible, x, y, setVisible, setX, setY, handleClick, flip}
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