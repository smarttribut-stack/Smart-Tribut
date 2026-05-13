import { useState } from 'react';

interface DataTableProps {
  isPro: boolean;
  onUpgrade: () => void;
}

interface Cell {
  value: string;
}

const ROWS = 6;
const COLS = 5;
const COL_LABELS = ['A', 'B', 'C', 'D', 'E'];

function makeGrid(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ value: '' }))
  );
}

export function DataTable({ isPro, onUpgrade }: DataTableProps) {
  const [open, setOpen] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>(makeGrid);
  const [title, setTitle] = useState('Mi tabla tributaria');

  if (!isPro) {
    return (
      <button type="button" className="btn-table-locked" onClick={onUpgrade} title="Solo plan Pro">
        🔒 📊
      </button>
    );
  }

  const updateCell = (r: number, c: number, value: string) => {
    setGrid(prev => prev.map((row, ri) =>
      ri === r ? row.map((cell, ci) => ci === c ? { value } : cell) : row
    ));
  };

  const exportCSV = () => {
    const csv = [COL_LABELS.join(','), ...grid.map(row => row.map(c => c.value).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearGrid = () => setGrid(makeGrid());

  return (
    <>
      <button type="button" className="btn-table" onClick={() => setOpen(true)} title="Abrir tabla">
        📊
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="table-modal" onClick={e => e.stopPropagation()}>
            <div className="table-modal-header">
              <input
                className="table-title-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <div className="table-actions">
                <button className="btn-table-action" onClick={exportCSV}>⬇ CSV</button>
                <button className="btn-table-action btn-table-clear" onClick={clearGrid}>🗑 Limpiar</button>
                <button className="btn-table-close" onClick={() => setOpen(false)}>✕</button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="row-num"></th>
                    {COL_LABELS.map(l => <th key={l}>{l}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {grid.map((row, ri) => (
                    <tr key={ri}>
                      <td className="row-num">{ri + 1}</td>
                      {row.map((cell, ci) => (
                        <td key={ci}>
                          <input
                            className="cell-input"
                            value={cell.value}
                            onChange={e => updateCell(ri, ci, e.target.value)}
                            placeholder=""
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="table-note">⭐ Función exclusiva del plan Pro · Exporta como CSV</p>
          </div>
        </div>
      )}
    </>
  );
}
