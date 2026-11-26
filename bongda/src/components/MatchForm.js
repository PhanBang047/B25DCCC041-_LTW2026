import { memo, useRef, useState } from 'react';
import { TOTAL_ROUNDS, parseScores } from '../utils';

const EMPTY = { homeId: '', awayId: '', home: '', away: '' };

function MatchForm({ teams, onAdd }) {
  const homeSelectRef = useRef(null); // focus lại ô chọn đội sau khi thêm
  const [round, setRound] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const sc = parseScores(form.home, form.away);
    if (sc.error) return setError(sc.error);
    const err = onAdd({
      round: Number(round), homeId: form.homeId, awayId: form.awayId,
      homeScore: sc.homeScore, awayScore: sc.awayScore,
    });
    if (err) return setError(err);
    setError('');
    setForm(EMPTY);
    homeSelectRef.current?.focus();
  };

  return (
    <section className="card">
      <h2>Thêm trận đấu</h2>
      <form className="form" onSubmit={submit}>
        <select value={round} onChange={(e) => setRound(e.target.value)}>
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <option key={i + 1} value={i + 1}>Vòng {i + 1}</option>
          ))}
        </select>
        <select ref={homeSelectRef} name="homeId" value={form.homeId} onChange={change}>
          <option value="">Đội nhà</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input type="number" min="0" name="home" value={form.home} onChange={change} placeholder="-" />
        <span>-</span>
        <input type="number" min="0" name="away" value={form.away} onChange={change} placeholder="-" />
        <select name="awayId" value={form.awayId} onChange={change}>
          <option value="">Đội khách</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button className="primary" type="submit">Thêm</button>
      </form>
      <p className="hint">Để trống tỷ số nếu trận chưa diễn ra.</p>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default memo(MatchForm);