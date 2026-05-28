"use client";

import { motion } from "framer-motion";
import { Plus, FileText, FileClock } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { useWalletData } from "@/hooks/useWalletData";
import { WalletCard } from "@/components/wallet/wallet-card";
import { ActionButton } from "@/components/wallet/action-button";
import { WalletActivityChart } from "@/components/wallet/wallet-activity-chart";
import { TransactionList } from "@/components/wallet/transaction-list";
import { WalletHeader } from "@/components/wallet/wallet-header";
import { BillingInfoModal } from "@/components/billing-info-modal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function WalletPage() {
  const {
    session,
    walletData,
    walletIsPending,
    transactionsIsPending,
    transactionsIsError,
    paginatedTransactions,
    totalPages,
    page,
    setPage,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    combinedChartData,
    isBillingModalOpen,
    setIsBillingModalOpen,
  } = useWalletData();

  return (
    <div data-loc="WalletPage" className="min-h-screen w-full relative">
      <main className="container mx-auto px-4 md:px-8 py-6 md:py-10 max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8 md:space-y-12"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <WalletHeader />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 space-y-6 md:space-y-8"
            >
              <WalletCard
                session={session}
                walletData={walletData}
                walletIsPending={walletIsPending}
              />

              <div className="flex flex-row gap-3 sm:gap-4 items-center justify-center">
                <ActionButton
                  icon={FileText}
                  label="Billing"
                  onClick={() => setIsBillingModalOpen(true)}
                />
                <ActionButton
                  icon={Plus}
                  label="Top Up"
                  href={ROUTES.AUTHENTICATED.BILLING}
                  primary
                />
                <ActionButton
                  icon={FileClock}
                  label="Invoices"
                  href="/billing#billing-history"
                />
              </div>

              <WalletActivityChart
                data={combinedChartData}
                totalPackages={walletData?.totalPackages || 0}
                totalPoints={walletData?.totalPoints || 0}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 space-y-4 h-full"
            >
              <TransactionList
                transactionsIsPending={transactionsIsPending}
                transactionsIsError={transactionsIsError}
                paginatedTransactions={paginatedTransactions}
                totalPages={totalPages}
                page={page}
                setPage={setPage}
                filter={filter}
                setFilter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </motion.div>
          </div>
        </motion.div>
      </main>
      <BillingInfoModal
        open={isBillingModalOpen}
        onOpenChange={setIsBillingModalOpen}
      />
    </div>
  );
}
