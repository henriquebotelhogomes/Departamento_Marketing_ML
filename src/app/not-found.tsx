import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-slate-600">A rota solicitada não existe ou foi movida.</p>
        <Link href="/dashboard" className="mt-4 inline-block rounded-md bg-teal-700 px-4 py-2 text-white">
          Ir para dashboard
        </Link>
      </div>
    </main>
  );
}
