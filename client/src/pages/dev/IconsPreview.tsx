import { useEffect, useState } from "react";

export default function IconsPreview() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    // fetch list from a simple JSON endpoint served by Vite dev server's public folder
    (async () => {
      try {
        const res = await fetch("/icons/things/index.json");
        if (res.ok) {
          const data = await res.json();
          setFiles(data.files || []);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Icons Preview (things)</h1>
      <p className="mb-4 text-sm text-slate-600">
        Arquivos em <code>/public/icons/things</code>. Copie o nome do arquivo para mapear.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {files.map((file) => (
          <div
            key={file}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
              <img
                src={`/icons/things/${file}`}
                alt={file}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <p className="mt-2 break-all text-xs font-semibold text-slate-700">{file}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
