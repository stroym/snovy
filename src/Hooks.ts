import React, {Dispatch, SetStateAction, useEffect, useState} from "react"

export function useOutsideClick(elementRef: React.RefObject<Element | undefined>):
  [boolean, Dispatch<SetStateAction<boolean>>] {

  const [inner, setInner] = useState(false)

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
      setInner(false)
    }
  }

  return [inner, setInner]
}