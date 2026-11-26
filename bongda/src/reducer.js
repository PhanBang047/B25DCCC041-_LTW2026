export const initialState = { teams: [], matches: [], loading: true, error: null };

export function matchesReducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, teams: action.payload.teams, matches: action.payload.matches };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_MATCH':
      return { ...state, matches: [...state.matches, action.payload] };
    case 'UPDATE_SCORE': {
      const { id, homeScore, awayScore } = action.payload;
      return {
        ...state,
        matches: state.matches.map((m) => (m.id === id ? { ...m, homeScore, awayScore } : m)),
      };
    }
    case 'DELETE_MATCH':
      return { ...state, matches: state.matches.filter((m) => m.id !== action.payload) };
    default:
      return state;
  }
}