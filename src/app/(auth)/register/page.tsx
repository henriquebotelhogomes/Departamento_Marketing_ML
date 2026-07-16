"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: RegisterForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: { message?: string };
    };

    if (!response.ok) {
      setIsLoading(false);
      setError(payload.error?.message ?? "Não foi possível criar sua conta.");
      return;
    }

    const loginResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setIsLoading(false);

    if (loginResult?.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setError("Conta criada, mas não foi possível autenticar automaticamente.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-600">Cadastre-se para acessar o dashboard.</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Nome</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
            placeholder="Seu nome"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
            placeholder="você@empresa.com"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Senha</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
            placeholder="Mínimo 6 caracteres"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Confirmar senha</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => onChange("confirmPassword", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-teal-500 focus:ring-2"
            placeholder="Repita a senha"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Criando conta..." : "Cadastrar"}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Já possui conta?{" "}
        <Link className="font-medium text-teal-700 hover:underline" href="/login">
          Entrar
        </Link>
      </p>
    </div>
  );
}
