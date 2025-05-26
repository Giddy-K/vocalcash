'use client'

import { useState, useMemo } from 'react'
import { Transaction } from '@/types/transaction'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'

/* ------------ constants ------------ */
const PER_PAGE = 5
type FilterType = 'all' | 'income' | 'expense'

/* ------------ main component ------------ */
export default function TransactionTable({ data }: { data: Transaction[] }) {
  /* ----- filters & pagination ----- */
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (typeFilter === 'all') return data
    return data.filter((t) => t.type === typeFilter)
  }, [data, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  /* ----- edit modal state ----- */
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Transaction>({ defaultValues: editing ?? undefined })

  /* ----- optimistic local state ----- */
  const [rows, setRows] = useState<Transaction[]>(data)

  /* ------------ helpers ------------ */
  const openEdit = (tx: Transaction) => {
    setEditing(tx)
    reset(tx) // preload form values
    setOpen(true)
  }

  const onSave = async (values: Transaction) => {
    if (!editing) return
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: values.amount,
        category: values.category,
        note: values.note,
      })
      .eq('id', editing.id)

    if (!error) {
      setRows((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...editing, ...values } : r))
      )
      setOpen(false)
    } else {
      alert(error.message)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) setRows((prev) => prev.filter((r) => r.id !== id))
    else alert(error.message)
  }

  /* ------------ render ------------ */
  if (!rows.length)
    return <p className="text-sm text-gray-500">No transactions yet.</p>

  return (
    <>
      {/* ---- filter buttons ---- */}
      <div className="mb-4 flex gap-2 text-sm">
        {(['all', 'income', 'expense'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setTypeFilter(f)
              setPage(1)
            }}
            className={clsx(
              'px-3 py-1 rounded border',
              typeFilter === f
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ---- table ---- */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
            <tr>
              {['Date', 'Type', 'Amount', 'Category', 'Note', 'Actions'].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginated.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2">{tx.created_at.slice(0, 10)}</td>
                <td
                  className={clsx(
                    'px-4 py-2 capitalize font-medium',
                    tx.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  {tx.type}
                </td>
                <td className="px-4 py-2 font-mono">
{tx.amount.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  })}
                </td>
                <td className="px-4 py-2">{tx.category || '-'}</td>
                <td className="px-4 py-2">{tx.note || '-'}</td>
                <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => openEdit(tx)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- pagination ---- */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={clsx(
              'px-3 py-1 rounded border',
              page === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={clsx(
              'px-3 py-1 rounded border',
              page === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            Next
          </button>
        </div>
      </div>

      {/* ---- edit modal ---- */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <Dialog.Title className="text-lg font-semibold mb-4">
                  Edit Transaction
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onSave)}
                  className="space-y-4 text-sm"
                >
                  <div>
                    <label className="block mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border rounded"
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Category</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      {...register('category')}
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Note</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded"
                      {...register('note')}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
