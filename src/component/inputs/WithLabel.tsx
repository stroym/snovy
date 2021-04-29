import React from "react"

interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
  value: string
  position: "before" | "after"
  vertical?: boolean
}

export const WithLabel = ({children, value, className, position, vertical, ...props}: LabelProps) => {

  const label = <div className="label-text">{value}</div>

  return (
    <label
      {...props} className={`labeled-input-wrapper ${className ?? ""}`}
      style={{
        flexDirection: vertical ? "column" : "row"
      }}
    >
      {position == "before" && label}
      {children}
      {position == "after" && label}
    </label>
  )
}

export default WithLabel