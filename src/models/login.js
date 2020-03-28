import { routerRedux } from 'dva/router';
import { login } from '../services/pfmlogin';
import { listByOrgCode, listByName} from '../services/sucorg';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';


export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { result: status, msg, userId, orgId, nickname, menus,roles, urns } = response;
      const currentUser = { userId, orgId, nickname, menus, urns,roles };

      yield put({
        type: 'changeLoginStatus',
        payload: { status, msg, type: payload.type, currentAuthority: 'admin' },
      });

      // Login successfully
      if (status === 1) {
        reloadAuthorized();
        yield put({
          type: 'user/saveCurrentUser',
          payload: currentUser,
        });

        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
    *listByOrgCode({ payload, callback }, { call, put }) {
      const response = yield call(listByOrgCode, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *listByName({ payload, callback }, { call, put }) {
      const response = yield call(listByName, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { status, msg, type, currentAuthority } = payload;
      setAuthority(currentAuthority);
      return {
        ...state,
        type,
        status,
        msg,
      };
    },
  },
};
