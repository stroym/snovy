import React from "react"
import {VirtualItem} from "react-virtual"

export function virtualizedStyle(vi: VirtualItem): React.CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: vi.size,
    transform: `translateY(${vi.start}px)`
  }
}