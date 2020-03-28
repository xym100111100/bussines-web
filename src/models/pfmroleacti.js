import { message } from 'antd';
import { list, modify, listAll } from '../services/pfmroleacti';

export default {
  namespace: 'pfmroleacti',

  state: {
    pfmacti: [],
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
    *listAll({ payload, callback }, { call, put }) {
      const response = yield call(listAll, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
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
  },

  reducers: {
    changeList(state, action) {
      return { pfmroleacti: action.payload };
    },
  },
};
