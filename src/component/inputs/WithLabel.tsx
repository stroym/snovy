import React from "react"

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  value: string
  position: "before" | "after"
}

export const WithLabel = ({children, value, className, position, ...props}: LabelProps) => {

  const label = <div className="label-text">{value}</div>

  return (
    <label {...props} className={`labeled-input-wrapper ${className ?? ""}`}>
      {position == "before" && label}
      {children}
      {position == "after" && label}
    </label>
  )
}

export default WithLabel