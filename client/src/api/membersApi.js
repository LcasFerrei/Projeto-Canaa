const BASE_URL = "/api/members";

export async function listMembers() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Erro ao carregar irmãos");
  return res.json();
}

export async function getMember(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Irmão não encontrado");
  return res.json();
}

export async function createMember(formData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erro ao salvar cadastro");
  }
  return res.json();
}

export async function updateMember(id, formData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erro ao atualizar cadastro");
  }
  return res.json();
}

export async function deleteMember(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao excluir cadastro");
}
