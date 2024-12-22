interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`h-full w-full bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}
