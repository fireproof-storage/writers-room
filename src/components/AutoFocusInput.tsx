import { useEffect, useRef } from 'react'

const AutoFocusInput = ({
  isActive,
  value,
  onChange,
  className
}: {
  isActive: boolean
  value: string
  onChange: (ok: React.ChangeEvent<HTMLInputElement>) => void
  className: string
}) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isActive && inputRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      inputRef.current.focus()
    }
  }, [isActive])

  return (
    <input
      title="input"
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}

export { AutoFocusInput }
