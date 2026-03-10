export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}
