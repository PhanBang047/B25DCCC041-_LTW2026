import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './App.css';
import { initialState, matchesReducer } from './reducer';
import { computeStandings, computeStats, pointsToTop, validateNewMatch } from './utils';
import StandingsTable from './components/StandingsTable';
import StatsPanel from './components/StatsPanel';
import MatchList from './components/MatchList';
import MatchForm from './components/MatchForm';

export default function App() {
  // useReducer: toàn bộ state dữ liệu giải đấu
  const [state, dispatch] = useReducer(matchesReducer, initialState);
  const { teams, matches, loading, error } = state;
  const [topN, setTopN] = useState(2);

  // useRef: giữ danh sách trận mới nhất để handleAdd không phải đổi identity
  const matchesRef = useRef(matches);
  matchesRef.current = matches;

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'LOAD_START' });
    fetch(`${process.env.PUBLIC_URL}/data/matches.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => !cancelled && dispatch({ type: 'LOAD_SUCCESS', payload: data }))
      .catch((err) => !cancelled && dispatch({ type: 'LOAD_ERROR', payload: err.message }));
    return () => { cancelled = true; };
  }, []);

  // useMemo: chỉ tính lại khi dữ liệu / topN đổi
  const teamNames = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t.name])), [teams]);
  const standings = useMemo(() => computeStandings(teams, matches), [teams, matches]);
  const stats = useMemo(() => computeStats(teams, matches, standings), [teams, matches, standings]);
  const needs = useMemo(() => pointsToTop(standings, topN), [standings, topN]);

  // useCallback: handler ổn định để React.memo của con có tác dụng
  const handleAdd = useCallback((match) => {
    const err = validateNewMatch(matchesRef.current, match);
    if (err) return err;
    dispatch({ type: 'ADD_MATCH', payload: { ...match, id: `m${Date.now()}` } });
    return null;
  }, []);
  const handleSave = useCallback(
    (id, homeScore, awayScore) => dispatch({ type: 'UPDATE_SCORE', payload: { id, homeScore, awayScore } }),
    []
  );
  const handleDelete = useCallback((id) => dispatch({ type: 'DELETE_MATCH', payload: id }), []);

  if (loading) return <div className="app">Đang tải dữ liệu...</div>;
  if (error) return <div className="app">Lỗi tải dữ liệu: {error}</div>;

  return (
    <div className="app">
      <h1>Giải bóng đá khoa</h1>
      <p className="sub">Bài 1 - React Hooks nâng cao (useReducer, useRef, useMemo, useCallback, React.memo)</p>

      <div className="toolbar">
        <label>
          Mục tiêu: lọt top
          <select value={topN} onChange={(e) => setTopN(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      <div className="grid">
        <StandingsTable standings={standings} needs={needs} topN={topN} />
        <StatsPanel stats={stats} />
      </div>

      <MatchForm teams={teams} onAdd={handleAdd} />
      <MatchList matches={matches} teamNames={teamNames} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}