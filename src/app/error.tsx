"use client";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-lg border border-red-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-red-700">Algo deu errado</h1>
        <p className="mt-2 text-sm text-slate-700">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
