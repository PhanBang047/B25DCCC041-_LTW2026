import { memo } from 'react';

function StatsPanel({ stats }) {
  const bw = stats.biggestWin;
  return (
    <section className="card">
      <h2>Thống kê</h2>
      <dl className="stats">
        <dt>Trận đã đá</dt><dd>{stats.played}/{stats.remaining + stats.played}</dd>
        <dt>Trận còn lại</dt><dd>{stats.remaining}</dd>
        <dt>Tổng bàn thắng</dt><dd>{stats.goals}</dd>
        <dt>Trung bình / trận</dt><dd>{stats.avgGoals.toFixed(2)}</dd>
        <dt>Số trận hòa</dt><dd>{stats.draws}</dd>
        <dt>Tấn công tốt nhất</dt>
        <dd>{stats.bestAttack ? `${stats.bestAttack.name} (${stats.bestAttack.value})` : '—'}</dd>
        <dt>Phòng ngự tốt nhất</dt>
        <dd>{stats.bestDefense ? `${stats.bestDefense.name} (${stats.bestDefense.value})` : '—'}</dd>
        <dt>Thắng đậm nhất</dt>
        <dd>{bw ? `${bw.home} ${bw.homeScore}-${bw.awayScore} ${bw.away}` : '—'}</dd>
      </dl>
    </section>
  );
}

export default memo(StatsPanel);