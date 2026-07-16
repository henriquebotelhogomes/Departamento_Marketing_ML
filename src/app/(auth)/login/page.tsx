"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo123");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError("Credenciais inválidas. Confira email e senha.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Entrar</h1>
        <p className="mt-1 text-sm text-slate-600">Acesse o CardSense com seu email e senha.</p>
      </div>

      <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
        Acesso demo: <strong>demo123</strong> / <strong>demo123</strong>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
            placeholder="você@empresa.com"
            autoComplete="username"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
            placeholder="Sua senha"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Não tem conta?{" "}
        <Link className="font-medium text-teal-700 hover:underline" href="/register">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
