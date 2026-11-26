import { memo } from 'react';
import StandingRow from './StandingRow';

function StandingsTable({ standings, needs, topN }) {
  return (
    <section className="card">
      <h2>Bảng xếp hạng</h2>
      <table className="standings">
        <thead>
          <tr>
            <th>#</th><th className="left">Đội</th><th>Trận</th><th>T</th><th>H</th><th>B</th>
            <th>BT</th><th>BB</th><th>HS</th><th>Điểm</th><th>Cần thêm</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((r) => (
            <StandingRow key={r.id} row={r} isTop={r.rank <= topN} need={needs[r.id]} />
          ))}
        </tbody>
      </table>
      <p className="hint">
        "Cần thêm" = điểm cần để hơn đội đang đứng hạng {topN} (hơn 1 điểm để chắc chắn vượt),
        chưa tính kết quả các đội khác. Mỗi đội đá tối đa 5 trận.
      </p>
    </section>
  );
}

export default memo(StandingsTable);