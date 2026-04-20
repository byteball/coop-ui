import { Container } from "#/shared/ui/container";

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <Container>
        Built on{" "}
        <a
          href="https://obyte.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Obyte
        </a>
      </Container>
    </footer>
  );
}
