export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-card rounded-2xl border-custom border ${className}`} {...props}>
      {children}
    </div>
  );
}
