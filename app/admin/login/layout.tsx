// This layout is specifically for the login page
// It doesn't require authentication
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

