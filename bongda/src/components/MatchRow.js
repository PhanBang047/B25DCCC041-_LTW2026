import { memo, useState } from 'react';
import { parseScores } from '../utils';

function MatchRow({ match, homeName, awayName, onSave, onDelete }) {
  const [home, setHome] = useState(match.homeScore ?? '');
  const [away, setAway] = useState(match.awayScore ?? '');
  const [error, setError] = useState('');

  const dirty =
    String(match.homeScore ?? '') !== String(home) || String(match.awayScore ?? '') !== String(away);

  const save = () => {
    const sc = parseScores(home, away);
    if (sc.error) return setError(sc.error);
    setError('');
    onSave(match.id, sc.homeScore, sc.awayScore);
  };

  return (
    <div>
      <div className="match">
        <span className="home">{homeName}</span>
        <span className="score">
          <input type="number" min="0" value={home} onChange={(e) => setHome(e.target.value)} />
          <span>-</span>
          <input type="number" min="0" value={away} onChange={(e) => setAway(e.target.value)} />
        </span>
        <span>{awayName}</span>
        <span className="actions">
          {match.homeScore == null && <span className="badge">Chưa đá</span>}
          <button className="primary" onClick={save} disabled={!dirty}>Lưu</button>
          <button className="danger" onClick={() => onDelete(match.id)}>Xóa</button>
        </span>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default memo(MatchRow);