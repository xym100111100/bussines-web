import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Row, Popconfirm, Col, Card, Form, Input, Select, Button, Table, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiLogistic.less';
import moment from 'moment';
import KdiEntryForm from './KdiEntryForm';
import KdiLogisticForm from './KdiLogisticForm';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@connect(({ kdilogistic, user, KdiEntry, kdicompany, loading }) => ({
  kdilogistic,
  kdicompany,
  KdiEntry,
  user,
  loading: loading.models.kdilogistic || loading.models.KdiEntry || loading.models.user || loading.models.kdicompany
}))
@Form.create()
export default class KdiLogistic extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdilogistic';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,

    };
    iframeHTML: '<div></div>'//用于打印
  }

  // 刷新
  handleReload() {
    let { user } = this.props
    let orgId = user.currentUser.orgId
    this.state.payloads = {
      orgId: orgId,
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });
  }

  //初始化
  componentDidMount() {
    let { user } = this.props
    let orgId = user.currentUser.orgId
    this.state.payloads = {
      orgId: orgId,
      pageNum: this.state.options.pageNum,
      pageSize: this.state.options.pageSize,
    };
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });
  }


  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.dispatch({
      type: `${this.moduleCode}/list`,
      payload: this.state.payloads,
    });
  };

  //点击submit查询
  list = () => {

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.receiverName;
      if (info !== undefined) {
        let reg = /[0-9]{13,30}/g;
        let reg2 = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.logisticCode = info;
          fieldsValue.receiverName = undefined;
        } else if (info.match(reg2) !== null) {
          fieldsValue.receiverMobile = info;
          fieldsValue.receiverName = undefined;
        }
      }
      fieldsValue.pageNum = this.state.options.pageNum;
      fieldsValue.pageSize = this.state.options.pageSize;
      fieldsValue.orgId = this.state.payloads.orgId;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.orderTime !== undefined && fieldsValue.orderTime !== '' && fieldsValue.orderTime.length >= 1) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTime = undefined;
      }
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  //改变页数查询
  handleTableChange = pagination => {

    const pager = { ...this.state.pagination };
    const { form } = this.props;
    pager.current = pagination.current;
    this.setState({
      options: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //使用正则来判断用户输入的是什么筛选条件,默认为名字，一旦是其他的就将名字设置为undefined
      let info = fieldsValue.receiverName;
      if (info !== undefined) {
        let reg = /[0-9]{13,30}/g;
        let reg2 = /[0-9]{5,11}/g;
        if (info.match(reg) !== null) {
          fieldsValue.logisticCode = info;
          fieldsValue.receiverName = undefined;
        } else if (info.match(reg2) !== null) {
          fieldsValue.receiverMobile = info;
          fieldsValue.receiverName = undefined;
        }
      }
      fieldsValue.pageNum = pagination.current;
      fieldsValue.pageSize = pagination.pageSize;
      fieldsValue.orgId = this.state.payloads.orgId;
      //上传上来的时间是一个数组，需要格式化
      if (fieldsValue.orderTime !== undefined && fieldsValue.orderTime !== '' && fieldsValue.orderTime.length >= 1) {
        fieldsValue.orderTimeEnd = fieldsValue.orderTime[1].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTimeStart = fieldsValue.orderTime[0].format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.orderTime = undefined;
      }
      this.props.dispatch({
        type: `${this.moduleCode}/list`,
        payload: fieldsValue,
      });
    });
  };

  //禁止选择当前日期后的
  disabledDate = current => {
    return current && current > moment().endOf('day');
  };

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { editFormRecord } = this.state;
    const { user } = this.props;
    let orgId = user.currentUser.orgId;
    editFormRecord.orgId = orgId;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="">
              {getFieldDecorator('receiverName')(<Input placeholder="收件人姓名/手机/快递单号/商品" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="">
              {getFieldDecorator('orderTime')(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem label="">
              {getFieldDecorator('logisticStatus')(
                <Select placeholder="状态" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">已揽收</Option>
                  <Option value="2">在途中</Option>
                  <Option value="3">已签收</Option>
                  <Option value="4">问题件</Option>
                  <Option value="0">无轨迹</Option>
                  <Option value="-1">作废</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span>
              <Button onClick={this.list} type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24} style={{ marginBottom: 20 }}>
            <Button
              icon="plus"
              type="primary"
              onClick={() => this.showAddForm({ orgId: orgId, editForm: 'kdiEntry', editFormTitle: '快递录入' })}
            >
              快递录入
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 作废订单
   */
  invalid = (record) => {
    const fieldsValue = {};
    fieldsValue.id = record.id;
    fieldsValue.logisticStatus = -1;
    this.props.dispatch({
      type: `${this.moduleCode}/invalid`,
      payload: fieldsValue,
      callback: () => {
        this.handleReload();
      },
    });
  }

  /**
   * 打印快递单
   */
  PrintPage=(id)=>{
    this.props.dispatch({
      type: `${this.moduleCode}/getById`,
      payload: { id },
      callback: (data) => {

          this.setState({
            iframeHTML: data.record.printPage
          }, () => {
            setTimeout(() => {
              this.refs.myFocusInput.contentWindow.print();
            }, 1000);
          })
      },
    });

  }


  render() {
    const { user, kdilogistic: { kdilogistic }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord } = this.state;
    let orgId = user.currentUser.orgId;
    let ps;
    if (kdilogistic === undefined || kdilogistic.pageSize === undefined) {
      ps = 5;
    } else {
      ps = kdilogistic.pageSize;
    }
    let tl;
    if (kdilogistic === undefined || kdilogistic.total === undefined) {
      tl = 1;
    } else {
      tl = Number(kdilogistic.total);
    }
    let kdilogisticData;
    if (kdilogistic === undefined) {
      kdilogisticData = [];
    } else {
      kdilogisticData = kdilogistic.list;
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: ps,
      total: tl,
      pageSizeOptions: ['5', '10'],
    };
    const columns = [
      {
        title: '快递单号',
        dataIndex: 'logisticCode',
        key: 'logisticCode',
        width: 150,
      },
      {
        title: '快递公司',
        dataIndex: 'shipperName',
        key: 'shipperName',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'logisticStatus',
        key: 'logisticStatus',
        width: 100,
        render: (text, record) => {
          if (record.logisticStatus === '0') return '无轨迹';
          if (record.logisticStatus === '1') return '已揽收';
          if (record.logisticStatus === '2') return '在途中';
          if (record.logisticStatus === '3') return '已签收';
          if (record.logisticStatus === '4') return '问题件';
          if (record.logisticStatus === '-1') return '作废';
        },
      },
      {
        title: '收件人',
        dataIndex: 'receiverName',
        key: 'receiverName',
        width: 100,
      },
      {
        title: '收件人手机',
        dataIndex: 'receiverMobile',
        key: 'receiverMobile',
        width: 100,
      },
      {
        title: '商品内容',
        dataIndex: 'orderTitle',
        key: 'orderTitle',
      },
      {
        title: '录入时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        width: 100,
      },
      {
        title: '操作',
        width: 150,
        render: (text, record) => {
          if (record.entryType === 1) {
            if (record.logisticStatus === '-1') {
              return (
                <Fragment  >
                  <a onClick={() => this.showEditForm({ id: record.id, editForm: 'KdiLogistic', editFormTitle: '编辑物流信息' })}>
                    修改
                  </a>
                  <br />
                  <a style={{ color: '#C0C0C0' }} >已作废</a>
                  <br />
                  <a onClick={()=>this.PrintPage(record.id)}>
                    打印快递单
                  </a>
                </Fragment>
              )
            } else {
              return (
                <Fragment  >
                  <a onClick={() => this.showEditForm({ id: record.id, editForm: 'KdiLogistic', editFormTitle: '编辑物流信息' })}>
                    修改
                  </a>
                  <br />
                  <Popconfirm title="是否要作废此物流单?" onConfirm={() => this.invalid(record)} >
                    <a >作废</a>
                  </Popconfirm>
                  <br />
                  <a onClick={()=>this.PrintPage(record.id)}>
                    打印快递单
                  </a>
                </Fragment>
              )
            }
          } else {
            if (record.logisticStatus === '-1') {
              return (
                <Fragment  >
                  <a style={{ color: '#C0C0C0' }}>修改</a>
                  <br />
                  <a style={{ color: '#C0C0C0' }}>已作废</a>
                </Fragment>
              )
            } else {
              return (
                <Fragment  >
                  <a style={{ color: '#C0C0C0' }}>修改</a>
                  <br />
                  <Popconfirm title="是否要作废此物流单?" onConfirm={() => this.invalid(record)} >
                    <a >作废</a>
                  </Popconfirm>
                </Fragment>
              )
            }

          }
        }
      },
    ];

    return (
      <PageHeaderLayout title="快递订单管理">
              <iframe name="print" style={{ display: 'none' }} ref="myFocusInput" srcdoc={this.state.iframeHTML} ></iframe>

        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableList}>
            <Table
              rowKey="id"
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleTableChange}
              dataSource={kdilogisticData}
              expandedRowRender={record => (
                <p style={{ margin: 0 }}>
                  <span><b>寄件人:</b>{record.senderName}</span>
                  <span style={{ paddingLeft: '15px' }}><b>寄件人手机:</b>{record.senderMobile}</span>
                  <span style={{ paddingLeft: '15px' }}><b>收件人地址:</b>{record.receiverProvince + record.receiverCity + record.receiverExpArea + record.receiverAddress}</span>
                </p>
              )}
              columns={columns}
            />
          </div>
        </Card>
        {editForm === 'kdiEntry' && (
          <KdiEntryForm
            width={900}
            visible
            isShowResetButton
            orgId={orgId}
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onNext={fields => this.handleSave({ fields })}
            onSubmit={fields => this.handleSubmit({ fields })}
          />
        )}
        {editForm === 'KdiLogistic' && (
          <KdiLogisticForm
            width={900}
            visible
            orgId={orgId}
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields })}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
