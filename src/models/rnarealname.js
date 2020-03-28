import { message } from 'antd';
import { list, getById, add, modify, del } from '../services/rnarealname';

export default {
  namespace: 'rnarealname',

  state: {
    rnarealname: [],
  },

  effects: {
    *list({ payload, callback }, { call, put }) {
      //默认查询待审核的。
      if (payload.applyState === undefined) {
        payload.applyState = 1;
      }
      if (payload.startApplyTime !== undefined && payload.startApplyTime !== '' && payload.startApplyTime.length >= 1) {
        payload.endApplyTime = payload.startApplyTime[1].format('YYYY-MM-DD HH:mm:ss');
        payload.startApplyTime = payload.startApplyTime[0].format('YYYY-MM-DD HH:mm:ss');
      }
      //判断用户输入的是用户名还是身份证
      if (/^[0-9]+$/.test(payload.nameOrIdCard)) {
        payload.idCard = payload.nameOrIdCard;
        payload.name = undefined;
      } else {
        payload.name = payload.nameOrIdCard;
        payload.idCard = undefined;
      }
      payload.nameOrIdCard = undefined;
      const response = yield call(list, payload);
      yield put({
        type: 'changeList',
        payload: response,
      });
      if (callback) callback(response);
    },
    *getById({ payload, callback }, { call }) {
      const response = yield call(getById, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
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
  },

  reducers: {
    changeList(state, action) {
      return {
        rnarealname: action.payload,
      };
    },
  },
};
