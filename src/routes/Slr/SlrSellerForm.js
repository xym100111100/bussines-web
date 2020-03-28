import React, { Fragment, PureComponent } from 'react';
import { Form, Input } from 'antd';
import EditForm from 'components/Rebue/EditForm';

const { TextArea } = Input;

// 添加与编辑的表单
@EditForm
@Form.create()
export default class SlrSellerForm extends PureComponent {
  render() {
    const FormItem = Form.Item;
    const { form } = this.props;
    return (
      <Fragment>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('accountId')(<Input type="hidden" />)}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卖家名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: false, message: '请输入卖家的名称' }],
          })(<Input placeholder="请输入卖家的名称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卖家简称">
          {form.getFieldDecorator('shortName', {
            rules: [{ required: false, message: '请输入卖家的简称' }],
          })(<Input placeholder="请输入卖家的简称" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="卖家描述">
          {form.getFieldDecorator('remark')(<TextArea placeholder="选填" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系方式">
          {form.getFieldDecorator('contact')(<Input placeholder="选填" />)}
        </FormItem>
      </Fragment>
    );
  }
}
