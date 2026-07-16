"use client";

import { useState } from "react";

type SegmentItem = {
  id: string;
  clusterId: number;
  label: string;
  description: string;
};

type SettingsFormProps = {
  activeModelVersion: string;
  segments: SegmentItem[];
};

export function SettingsForm({ activeModelVersion, segments }: SettingsFormProps) {
  const [version, setVersion] = useState(activeModelVersion);
  const [items, setItems] = useState(segments);
  const [message, setMessage] = useState<string | null>(null);

  const updateLabel = (id: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, label: value } : item)));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activeModelVersion: version,
        segments: items.map((item) => ({ clusterId: item.clusterId, label: item.label })),
      }),
    });

    if (response.ok) {
      setMessage("Configurações salvas com sucesso.");
      return;
    }

    setMessage("Não foi possível salvar as configurações.");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">Versão ativa do modelo</span>
        <input
          value={version}
          onChange={(event) => setVersion(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.id} className="block space-y-1">
            <span className="text-sm text-slate-600">Cluster {item.clusterId}</span>
            <input
              value={item.label}
              onChange={(event) => updateLabel(item.id, event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
        ))}
      </div>

      <button className="rounded-md bg-teal-700 px-4 py-2 font-medium text-white">Salvar</button>
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
    </form>
  );
}
