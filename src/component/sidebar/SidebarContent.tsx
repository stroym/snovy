import React from "react"

export interface SidebarContentProps extends React.HTMLProps<HTMLDivElement> {
  heading?: React.ReactNode
  footing?: React.ReactNode
}

export const SidebarContent = ({id, children, heading, footing}: SidebarContentProps) => {

  return (
    <div className="sidebar-content" id={id}>
      {
        heading &&
        <div className="sidebar-heading">
          {heading}
        </div>
      }
      <div className="sidebar-body" tabIndex={-1}>
        {children}
      </div>
      {
        footing &&
        <div className="sidebar-footing">
          {footing}
        </div>
      }
    </div>
  )

}

export default SidebarContent