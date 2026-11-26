import type { AuthAction, AuthState } from '../types';

export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  isAuthenticated: false,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    }

    case 'LOGOUT': {
      return {
        user: null,
        isAuthenticated: false,
      };
    }

    case 'UPDATE_PROFILE': {
      if (!state.user) {
        return state;
      }

      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload.name !== undefined ? action.payload.name : state.user.name,
          city: action.payload.city !== undefined ? action.payload.city : state.user.city,
          email: action.payload.email !== undefined ? action.payload.email : state.user.email,
        },
      };
    }

    case 'RECORD_ORDER': {
      if (!state.user) {
        return state;
      }

      return {
        ...state,
        user: {
          ...state.user,
          orders: [action.payload, ...state.user.orders],
        },
      };
    }

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
