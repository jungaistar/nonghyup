// Font Awesome 아이콘 래퍼.
// name 예: "fa-solid fa-book-open"
export default function Icon({ name, className = '' }) {
  if (!name) return null
  return <i className={`${name} ${className}`} aria-hidden="true" />
}
