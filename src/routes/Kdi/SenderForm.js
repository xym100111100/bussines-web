import React, { Fragment, PureComponent } from 'react';
import { Form, Row, Col,Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import AddrCascader from 'components/Kdi/AddrCascader';
import styles from './KdiSender.less';
const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.pfmsys,
}))
@EditForm
export default class SenderForm extends PureComponent {
  state = {
    see: 'password',
  };

  show = () => {
    if (this.state.see === 'password') {
      this.setState({ see: 'text' });
    } else {
      this.setState({ see: 'password' });
    }
  };

  render() {
    const { form } = this.props;

    const types = {
      type: this.state.see,
    };

    return (
      <Fragment>
          <div className={styles.tableListForm}>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('orgId')(<Input type="hidden" />)}
        <Form  layout="inline">
        <Row  gutter={{ md: 6, lg: 24, xl: 48 }} >
          <Col md={18} sm={24} push={2} >
        <FormItem  style={{ paddingLeft: 26 }}  label="名称">
          {form.getFieldDecorator('senderName', {
            rules: [{ required: true, message: '请输入发件人名称' }],
          })(<Input placeholder="请输入发件人名称" />)}
        </FormItem>
        <FormItem style={{ paddingLeft: 26 }}    label="手机">
          {form.getFieldDecorator('senderMobile', {
            rules: [{ required: true, pattern: /^[0-9]*$/, message: '请输入全部为数字的发件人手机' }],
          })(<Input placeholder="请输入发件人手机" />)}
        </FormItem>
        <FormItem style={{ paddingLeft: 34 }}  label="电话">
          {form.getFieldDecorator('senderTel', {
            rules: [{ pattern: /^[0-9]*$/, message: '请输入全部为数字的发件人电话' }],
          })(<Input placeholder="请输入发件人电话" />)}
        </FormItem>
        <FormItem style={{ paddingLeft: 26 }}    label="邮编">
          {form.getFieldDecorator('senderPostCode', {
            rules: [{ required: true, pattern: /^\d{6}$/, message: '请输入六位且全为数字的发件地邮编' }],
          })(<Input placeholder="请输入发件地邮编" />)}
        </FormItem>
        <FormItem style={{ paddingLeft: 26 }}    label="地址">
          {form.getFieldDecorator('senderaddr', {
            rules: [{ required: true, message: '请选择发件人地址' }],
          })(<AddrCascader  />)}
        </FormItem>
        <FormItem  label="详细地址">
          {form.getFieldDecorator('senderAddress', {
            rules: [{ required: true, message: '请输入详细地址' }],
          })(<Input placeholder="请输入详细地址" />)}
        </FormItem>
        </Col>
        </Row>
        </Form>
        </div>
      </Fragment>
    );
  }
}
