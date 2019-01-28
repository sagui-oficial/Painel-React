import { GET_GUIAS, SAVE_GUIAS, DELETE_GUIAS } from '../actions/guias';

const INITIAL_STATE = {
  guias: [],
};

export default function (state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case GET_GUIAS:
      return {
        ...state,
        guias: action.payload,
      };
    case SAVE_GUIAS:
      return {
        ...state,
        guias: state.guias.concat([action.payload]),
      };
    case DELETE_GUIAS:
      return {
        ...state,
        guias: state.guias.filter(guia => guia.id !== action.payload.id),
      };
    default:
      return state;
  }
}
