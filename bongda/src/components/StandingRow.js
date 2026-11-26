import { memo } from 'react';

function NeedCell({ need }) {
  if (!need) return null;
  if (need.status === 'in') return <span className="badge ok">Trong top</span>;
  if (need.status === 'chase') return <span className="badge chase">+{need.need} điểm</span>;
  return <span className="badge no">Không đủ trận</span>;
}

function StandingRow({ row, isTop, need }) {
  return (
    <tr className={isTop ? 'top' : ''}>
      <td>{row.rank}</td>
      <td className="left">{row.name}</td>
      <td>{row.played}</td>
      <td>{row.won}</td>
      <td>{row.drawn}</td>
      <td>{row.lost}</td>
      <td>{row.gf}</td>
      <td>{row.ga}</td>
      <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
      <td><strong>{row.points}</strong></td>
      <td><NeedCell need={need} /></td>
    </tr>
  );
}

export default memo(StandingRow);