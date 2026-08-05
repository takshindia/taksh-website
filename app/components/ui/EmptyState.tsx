import Link from "next/link";

export default function EmptyState({ title, message, action }: { title: string; message?: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-2xl border border-yellow-500/20 bg-[#111] p-10 text-center">
      <h2 className="text-2xl font-bold text-yellow-400">{title}</h2>
      {message && <p className="mt-3 text-gray-400">{message}</p>}
      {action && (
        <div className="mt-6">
          <Link href={action.href} className="inline-block rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400">
            {action.label}
          </Link>
        </div>
      )}
    </div>
  );
}
