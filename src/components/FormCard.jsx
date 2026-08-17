export default function FormCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-canaa-bg p-5 shadow-lg sm:p-6">
      {title && (
        <h2 className="mb-5 whitespace-pre-line text-center text-base font-extrabold uppercase text-canaa-blue sm:text-lg">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
