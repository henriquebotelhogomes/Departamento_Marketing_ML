import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-16 md:px-10">
        <p className="inline-block w-fit rounded-full border border-slate-300 bg-white px-4 py-1 text-sm text-slate-700">
          CardSense - Marketing Analytics
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          Descubra segmentos de clientes e personalize campanhas com dados reais.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Plataforma analítica para segmentação inteligente de clientes de cartão de crédito,
          com pipeline de ML e dashboard executivo.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white transition hover:bg-teal-800"
          >
            Acessar dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Entrar
          </Link>
        </div>
      </section>
    </main>
  );
}
