import { message } from 'antd';
import { list, getById, add, detail, buyrelation, shipmentconfirmation, modify, del, bulkShipment,bulkSubscription } from '../services/suporder';
import { logisticList } from '../services/kdilogistic';
import { detailList,listOrderdetaildeliver, getTraceAndDeliver, deliver } from '../services/ordorder';

export default {
  namespace: 'suporder',

  state: {
    suporder: [],
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
    *deliver({ payload, callback }, { call }) {//确认发货并打印快递单
      const response = yield call(deliver, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *listOrderdetaildeliver({ payload, callback }, { call, put }) {
      const response = yield call(listOrderdetaildeliver, payload);
      if (callback) callback(response);
    },
    *getTraceAndDeliver({ payload, callback }, { call }) {//获取物流轨迹并发货
      const response = yield call(getTraceAndDeliver, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *detailList({ payload, callback }, { call, put }) {
      const response = yield call(detailList, payload);
      if (callback) callback(response);
    },
    *detail({ payload, callback }, { call, put }) {
      const response = yield call(detail, payload);
      if (callback) callback(response);
    },

    *buyrelation({ payload, callback }, { call, put }) {
      const response = yield call(buyrelation, payload);
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
    *shipmentconfirmation({ payload, callback }, { call }) {//确认发货并打印快递单
      const response = yield call(shipmentconfirmation, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *logisticList({ payload, callback }, { call, put }) {
      const response = yield call(logisticList, payload);
      if (callback) callback(response);
    },
    *bulkSubscription({ payload, callback }, { call }) {//批量订阅
      const response = yield call(bulkSubscription, payload);
      if (response.result === 1) {
        message.success(response.msg);
        if (callback) callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *bulkShipment({ payload, callback }, { call }) {//批量发货
      const response = yield call(bulkShipment, payload);
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
        suporder: action.payload,
      };
    },
  },
};