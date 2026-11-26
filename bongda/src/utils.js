export const TOTAL_ROUNDS = 5;
export const MATCHES_PER_TEAM = 5;
export const TOTAL_MATCHES = 15;

export const isPlayed = (m) =>
  Number.isInteger(m.homeScore) && Number.isInteger(m.awayScore);

/** Tính bảng xếp hạng: điểm -> hiệu số -> bàn thắng -> tên */
export function computeStandings(teams, matches) {
  const table = new Map(
    teams.map((t) => [
      t.id,
      { id: t.id, name: t.name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    ])
  );
  for (const m of matches) {
    if (!isPlayed(m)) continue;
    const h = table.get(m.homeId);
    const a = table.get(m.awayId);
    if (!h || !a) continue;
    h.played++; a.played++;
    h.gf += m.homeScore; h.ga += m.awayScore;
    a.gf += m.awayScore; a.ga += m.homeScore;
    if (m.homeScore > m.awayScore) { h.won++; a.lost++; h.points += 3; }
    else if (m.homeScore < m.awayScore) { a.won++; h.lost++; a.points += 3; }
    else { h.drawn++; a.drawn++; h.points += 1; a.points += 1; }
  }
  return [...table.values()]
    .map((r) => ({ ...r, gd: r.gf - r.ga }))
    .sort(
      (x, y) =>
        y.points - x.points || y.gd - x.gd || y.gf - x.gf || x.name.localeCompare(y.name, 'vi')
    )
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

/**
 * Mỗi đội cần thêm bao nhiêu điểm để vào top N.
 * So với điểm hiện tại của đội đang đứng hạng N: cần hơn 1 điểm để chắc chắn vượt.
 * status: 'in' (đã trong top) | 'chase' (còn cơ hội) | 'impossible' (không đủ trận)
 */
export function pointsToTop(standings, topN) {
  const result = {};
  const cutoff = standings[Math.min(topN, standings.length) - 1];
  for (const r of standings) {
    if (!cutoff || r.rank <= topN) {
      result[r.id] = { status: 'in', need: 0 };
      continue;
    }
    const need = cutoff.points - r.points + 1;
    const maxGain = (MATCHES_PER_TEAM - r.played) * 3;
    result[r.id] = { status: need <= maxGain ? 'chase' : 'impossible', need };
  }
  return result;
}

export function computeStats(teams, matches, standings) {
  const names = Object.fromEntries(teams.map((t) => [t.id, t.name]));
  const played = matches.filter(isPlayed);

  let goals = 0;
  let draws = 0;
  for (const m of played) {
    goals += m.homeScore + m.awayScore;
    if (m.homeScore === m.awayScore) draws += 1;
  }

  let big = null;
  for (const m of played) {
    const diff = Math.abs(m.homeScore - m.awayScore);
    if (diff === 0) continue;
    const total = m.homeScore + m.awayScore;
    if (!big || diff > big.diff || (diff === big.diff && total > big.total)) {
      big = { m, diff, total };
    }
  }

  const withGames = standings.filter((r) => r.played > 0);
  const attack = [...withGames].sort((a, b) => b.gf - a.gf)[0];
  const defense = [...withGames].sort((a, b) => a.ga - b.ga)[0];

  return {
    scheduled: matches.length,
    played: played.length,
    remaining: TOTAL_MATCHES - played.length,
    goals,
    draws,
    avgGoals: played.length ? goals / played.length : 0,
    biggestWin: big && {
      home: names[big.m.homeId],
      away: names[big.m.awayId],
      homeScore: big.m.homeScore,
      awayScore: big.m.awayScore,
    },
    bestAttack: attack && { name: attack.name, value: attack.gf },
    bestDefense: defense && { name: defense.name, value: defense.ga },
  };
}

/** Đọc cặp tỷ số từ ô input (chuỗi). Trống cả hai = chưa đá. */
export function parseScores(h, a) {
  const hs = String(h).trim();
  const as = String(a).trim();
  if (hs === '' && as === '') return { homeScore: null, awayScore: null };
  if (hs === '' || as === '') return { error: 'Nhập đủ cả hai tỷ số hoặc để trống cả hai.' };
  const x = Number(hs);
  const y = Number(as);
  if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0) {
    return { error: 'Tỷ số phải là số nguyên không âm.' };
  }
  return { homeScore: x, awayScore: y };
}

/** Trả về chuỗi lỗi, hoặc null nếu hợp lệ */
export function validateNewMatch(matches, { round, homeId, awayId }) {
  if (!homeId || !awayId) return 'Hãy chọn đủ hai đội.';
  if (homeId === awayId) return 'Hai đội phải khác nhau.';
  const samePair = (m) =>
    (m.homeId === homeId && m.awayId === awayId) || (m.homeId === awayId && m.awayId === homeId);
  if (matches.some(samePair)) return 'Hai đội này đã gặp nhau rồi (đá vòng tròn một lượt).';
  const busy = (m) =>
    m.round === round && [m.homeId, m.awayId].some((id) => id === homeId || id === awayId);
  if (matches.some(busy)) return `Có đội đã có trận trong vòng ${round}.`;
  return null;
}