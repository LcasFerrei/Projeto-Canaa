import { triggerDownload } from "./download";
import { getAge } from "./birthday";

function escapeField(value) {
  const str = String(value ?? "");
  if (/[;"\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function fieldDisplayValue(field, value) {
  if (field.type === "radio") {
    return field.options?.find((o) => o.value === value)?.label || value || "";
  }
  if (field.type === "children-list") {
    return (Array.isArray(value) ? value : []).filter(Boolean).join(", ");
  }
  return value ?? "";
}

export function recordsToCsv(records, schema) {
  const fields = schema.steps.flatMap((s) => s.fields).filter((f) => f.type !== "photo");

  const headers = [];
  fields.forEach((field) => {
    headers.push(field.label.replace(/\n/g, " "));
    if (field.id === "dataNascimento") headers.push("Idade");
  });
  headers.push("Observações Internas", "Enviado em");

  const rows = records.map((r) => {
    const row = [];
    fields.forEach((field) => {
      row.push(fieldDisplayValue(field, r[field.id]));
      if (field.id === "dataNascimento") row.push(getAge(r.dataNascimento) ?? "");
    });
    row.push(r.observacoesInternas, r.enviadoEm ? new Date(r.enviadoEm).toLocaleString("pt-BR") : "");
    return row;
  });

  const lines = [headers, ...rows].map((row) => row.map(escapeField).join(";"));
  return lines.join("\r\n");
}

export function downloadCsv(records, schema, filename = "cadastros-canaa.csv") {
  const csv = recordsToCsv(records, schema);
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}
