export function WalletHeader() {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent">
        Wallet
      </h1>
      <p className="text-muted-foreground text-base md:text-lg">
        Manage your points, track transactions, and view your package
        balance in real-time.
      </p>
    </div>
  );
}
