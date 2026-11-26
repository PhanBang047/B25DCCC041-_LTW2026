import { memo, useMemo } from 'react';
import MatchRow from './MatchRow';

function MatchList({ matches, teamNames, onSave, onDelete }) {
  const rounds = useMemo(() => {
    const groups = {};
    matches.forEach((m) => {
      if (!groups[m.round]) groups[m.round] = [];
      groups[m.round].push(m);
    });
    return Object.entries(groups).sort((a, b) => a[0] - b[0]);
  }, [matches]);

  return (
    <section className="card">
      <h2>Lịch thi đấu và tỷ số</h2>
      {rounds.length === 0 && <p className="muted">Chưa có trận nào.</p>}
      {rounds.map(([round, list]) => (
        <div key={round}>
          <h3>Vòng {round}</h3>
          {list.map((m) => (
            <MatchRow
              key={m.id}
              match={m}
              homeName={teamNames[m.homeId]}
              awayName={teamNames[m.awayId]}
              onSave={onSave}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </section>
  );
}

export default memo(MatchList);