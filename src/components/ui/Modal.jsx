import { useEffect } from 'react'
import { IconX } from './Icons.jsx'

export default function Modal({ open, onClose, title, children, sm }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal-box ${sm ? 'modal-sm' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}><IconX /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
