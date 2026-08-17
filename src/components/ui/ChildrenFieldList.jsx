export default function ChildrenFieldList({ filhos, updateFilho, addFilho, removeFilho }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-canaa-blue">
        Nome Completo dos Filhos que Congregam na Igreja
      </span>
      {filhos.map((filho, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={filho}
            onChange={(e) => updateFilho(i, e.target.value)}
            className="w-full rounded-md border border-canaa-light bg-canaa-white px-3 py-2.5
              text-sm text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-canaa-light/70"
          />
          {filhos.length > 1 && (
            <button
              type="button"
              onClick={() => removeFilho(i)}
              aria-label="Remover filho"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg
                font-bold text-canaa-blue/60 transition hover:bg-canaa-blue/10 hover:text-canaa-blue"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addFilho}
        className="mt-1 flex w-fit items-center gap-1.5 text-sm font-bold text-canaa-blue hover:underline"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-canaa-blue text-xs text-white">
          +
        </span>
        Adicionar filho(a)
      </button>
    </div>
  );
}
