import { triggerDownload } from "./download";

export function downloadBackup(records, filename = "backup-cadastros-canaa.json") {
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  triggerDownload(blob, filename);
}

export function parseBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error("O arquivo não contém uma lista de cadastros válida.");
        resolve(data);
      } catch {
        reject(new Error("Não foi possível ler este arquivo como backup válido."));
      }
    };
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsText(file);
  });
}
