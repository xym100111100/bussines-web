import { message } from 'antd';
import { list, getById, add, modify, del, listByAccountId,recharge} from '../services/pntList';

export default {
  namespace: 'pntList',

  state: {
    pntList: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *modify({ payload, callback }, { call }) {
      const response = yield call(modify, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *del({ payload, callback }, { call }) {
      const response = yield call(del, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *listByAccountId({ payload, callback }, { call }) {
      const response = yield call(listByAccountId, payload);
      if (callback) callback(response);
    },
    *recharge({ payload, callback }, { call }) {
      const response = yield call(recharge, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    }
  },
  reducers: {
    changeList(state, action) {
      return {
        pntList: action.payload,
      };
    },
  },
};
