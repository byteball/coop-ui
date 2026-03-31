import { Header } from "#/widgets/header";
import { Footer } from "#/widgets/footer";
import { Container } from "#/shared/ui/container";
import { useMatch } from "@tanstack/react-router";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isHome = useMatch({ from: "/", shouldThrow: false });

  return (
    <div className="flex min-h-screen flex-col pt-14">
      <Header />
      {isHome ? (
        <div className="flex-1">{children}</div>
      ) : (
        <Container className="flex-1 pb-8 pt-8">{children}</Container>
      )}
      <Footer />
    </div>
  );
}
