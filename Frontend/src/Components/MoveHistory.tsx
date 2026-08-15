export const MoveHistory = ({ history }: { history: string[] }) => {
    const rows: { num: number; white: string; black?: string }[] = [];
    for (let i = 0; i < history.length; i += 2) {
        rows.push({ num: i / 2 + 1, white: history[i], black: history[i + 1] });
    }

    return (
        <div className="rounded-lg bg-neutral-800 p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">Moves</h3>
            {rows.length === 0 ? (
                <p className="text-sm text-neutral-500">No moves yet</p>
            ) : (
                <ol className="max-h-64 space-y-1 overflow-y-auto text-sm text-neutral-200">
                    {rows.map((row) => (
                        <li key={row.num} className="flex gap-2">
                            <span className="w-6 text-neutral-500">{row.num}.</span>
                            <span className="w-16">{row.white}</span>
                            <span>{row.black ?? ""}</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};
