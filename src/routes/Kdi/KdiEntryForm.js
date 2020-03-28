import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Divider } from 'antd';
import styles from './KdiEntry.less';
import AddrCascader from 'components/Kdi/AddrCascader';
import KdiCompany from 'components/Kdi/KdiCompany';
import AddrRanalysis from 'components/Kdi/AddrRanalysis';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ kdientry, kdilogistic, user, loading }) => ({ kdientry, kdilogistic, user, loading: loading.models.kdientry || loading.models.user }))
@EditForm
export default class KdiEntryForm extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdientry';
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  /**
   * 收发件人的自定义规则
   */
  provinceInfo = (rule, value, callback) => {
    if (value === undefined || value.length < 3) {
      callback('请选择完省市区 ');
    } else {
      callback();
    }
  };

  /**
   * 根据手机号码查询收件人信息
   */
  getReceivers = e => {
    this.props.dispatch({
      type: `kdilogistic/getReceiver`,
      payload: {
        receiverMobile: e.target.value
      },
      callback: data => {
        console.log(data);
        if (data !== undefined) {
          const { form } = this.props;
          form.getFieldDecorator('receiverName');
          form.getFieldDecorator('receiverMobile');
          form.getFieldDecorator('receiverPostCode');
          form.getFieldDecorator('receiverProvince');
          form.getFieldDecorator('receiverAddress');
          form.setFieldsValue({
            receiverName: data.receiverName,
            receiverMobile: data.receiverMobile,
            receiverPostCode: data.receiverPostCode,
            receiverProvince: [data.receiverProvince, data.receiverCity, data.receiverExpArea],
            receiverAddress: data.receiverAddress,
          });
        }
      },
    });
  }

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { kdientry: { kdientry }, loading, form } = this.props;
    return (
      <Form onSubmit={() => this.entry()} layout="inline">
        <Row>
          <Col md={24} sm={24} push={1}>
            <h3 style={{ marginBottom: 20 }}>物流信息</h3>
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={24} push={1}>
            <FormItem style={{ paddingLeft: 15 }} label="物流单号">
              {getFieldDecorator('logisticCode', {
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9]*$/,
                    message: '请输入全部为数字的物流单号',
                  },
                ],
              })(<Input placeholder="请输入全部为数字的物流单号" />)}
            </FormItem>
            <FormItem label="订单标题" style={{ paddingLeft: 15 }}>
              {getFieldDecorator('orderTitle', {
                rules: [
                  {
                    required: true,
                    message: '请输入订单标题',
                  },
                ],
              })(<Input placeholder="请输入订单标题" />)}
            </FormItem>
          </Col>
          <Col md={10} sm={24} push={2}>
            <KdiCompany FormItemStyle={{ paddingLeft: 15 }} form={form} />
          </Col>
        </Row>
        <Row gutter={{ md: 1, lg: 4, xl: 2 }}>
          <Col md={10} sm={24} push={1}>

            <h3 style={{ paddingTop: 10, marginBottom: 40 }}>发件人信息</h3>
            <FormItem label="发件人姓名">
              {getFieldDecorator('senderName', {
                rules: [
                  {
                    required: true,
                    message: '请输入发件人姓名',
                  },
                ],
              })(<Input placeholder="请输入发件人姓名" />)}
            </FormItem>
            <FormItem label="发件人手机">
              {getFieldDecorator('senderMobile', {
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9]*$/,
                    message: '请输入全部为数字的发件人手机',
                  },
                ],
              })(<Input placeholder="请输入全部为数字的发件人手机" />)}
            </FormItem>
            <FormItem label="发件地邮编">
              {getFieldDecorator('senderPostCode', {
                rules: [
                  {
                    required: true,
                    pattern: /^\d{6}$/,
                    message: '请输入六位全部为数字发件地邮编',
                  },
                ],
                initialValue: '530000'
              })(<Input placeholder="请输入发件地邮编" />)}
            </FormItem>
            <FormItem label="发件人地址">
              {getFieldDecorator('senderProvince', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                  ,
                  {
                    validator: this.provinceInfo,
                  },
                ],
              })(<AddrCascader />)}
            </FormItem>
            <FormItem label="详细地址" style={{ paddingLeft: 15 }}>
              {getFieldDecorator('senderAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入发件人详细地址',
                  },
                ],
              })(<Input placeholder="请输入发件人详细地址" />)}
            </FormItem>
            <FormItem label="智能解析" style={{ paddingLeft: 24 }}>
              {getFieldDecorator('sender')(<AddrRanalysis who="sender" form={form} />)}
            </FormItem>
          </Col>

          <Col md={1} sm={24} push={1} style={{ textAlign: 'center' }}>
            <Divider type="vertical" style={{ height: 220, marginTop: 110 }} />
          </Col>
          <Col md={10} sm={24} push={1}>
            <h3 style={{ paddingTop: 10, marginBottom: 40 }}>收件人信息</h3>
            <FormItem label="收件人姓名">
              {getFieldDecorator('receiverName', {
                rules: [
                  {
                    required: true,
                    message: '请输入收件人姓名',
                  },
                ],
              })(<Input placeholder="请输入收件人姓名" />)}
            </FormItem>
            <FormItem label="收件人手机">
              {getFieldDecorator('receiverMobile', {
                rules: [
                  {
                    required: true,
                    pattern: /^[0-9]*$/,
                    message: '请输入全部为数字的收件人手机',
                  },
                ],
              })(<Input placeholder="请输入全部为数字的收件人手机" onPressEnter={this.getReceivers.bind(this)} />)}
            </FormItem>
            <FormItem label="收件地邮编">
              {getFieldDecorator('receiverPostCode', {
                rules: [
                  {
                    required: true,
                    pattern: /^\d{6}$/,
                    message: '请输入六位全部为数字收件地邮编',
                  },
                ],
                initialValue: '000000'
              })(<Input placeholder="请输入收件地邮编" />)}
            </FormItem>
            <FormItem label="收件人地址">
              {getFieldDecorator('receiverProvince', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                  {
                    validator: this.provinceInfo,
                  },
                ],
              })(<AddrCascader />)}
            </FormItem>
            <FormItem label="详细地址" style={{ paddingLeft: 15 }}>
              {getFieldDecorator('receiverAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入收件人详细地址',
                  },
                ],
              })(<Input placeholder="请输入收件人详细地址" />)}
            </FormItem>
            <FormItem label="智能解析" style={{ paddingLeft: 24 }}>
              {getFieldDecorator('receiver')(<AddrRanalysis who="receiver" form={form} />)}
            </FormItem>
          </Col>
        </Row>

      </Form>
    );
  }

  render() {
    const { form } = this.props;

    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('orgId')(<Input type="hidden" />)}
        <div style={{ background: 'white' }} className={styles.tableListForm}>
          {this.renderSearchForm()}
        </div>
      </Fragment>
    );
  }
}
