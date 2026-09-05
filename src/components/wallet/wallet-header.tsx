import { StickyPageHeader } from "@/components/sticky-page-header";

export function WalletHeader() {
  return (
    <StickyPageHeader
      title="Wallet"
      backHref="/app/dashboard"
      titleClassName="text-3xl sm:text-5xl font-bold bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0 pb-1"
    >
      <p className="text-muted-foreground text-base md:text-lg mb-6">
        Manage your packages, track transactions, and view your balances
        in real-time.
      </p>
    </StickyPageHeader>
  );
}
