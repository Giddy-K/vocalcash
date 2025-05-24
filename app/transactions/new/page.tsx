import TransactionForm from "@/components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <p className="italic text-gray-500">
        📸 Photo receipt scanning coming soon…
      </p>
      <h1 className="text-2xl font-bold mb-4">New Transaction</h1>
      <TransactionForm />
    </main>
  );
}
