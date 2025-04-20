// components/Spinner.js

export default function Spinner({ size = 'md', color = 'violet' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  const colorClasses = {
    violet: 'border-violet-500',
    blue: 'border-blue-500',
    neutral: 'border-neutral-500',
    // Добавь другие цвета если нужно
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.violet;

  return (
    <div
      className={`inline-block ${spinnerSize} animate-spin rounded-full border-solid ${spinnerColor} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Загрузка...
      </span>
    </div>
  );
}