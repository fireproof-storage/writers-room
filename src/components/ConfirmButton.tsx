import { useEffect, useState } from 'react'

export function ConfirmButton({
  onConfirm,
  initialText = 'Submit',
  confirmText = 'Confirm'
}: {
  onConfirm: () => void
  initialText?: string
  confirmText?: string
}) {
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    if (confirm) {
      const timeout = setTimeout(() => {
        setConfirm(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [confirm])

  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (confirm) {
      onConfirm()
      setConfirm(false)
    } else {
      setConfirm(true)
    }
  }

  const baseStyle = `px-4 py-2 m-2 rounded text-white ${confirm ? '' : 'transition duration-500'}`
  const initialStyle = 'bg-slate-500 hover:bg-slate-600'
  const confirmStyle = 'bg-yellow-500 hover:bg-yellow-600'

  return (
    <button
      onClick={handleClick}
      className={`${baseStyle} ${confirm ? confirmStyle : initialStyle}`}
    >
      {confirm ? confirmText : initialText}
    </button>
  )
}
