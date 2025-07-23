
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
  );
}