import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CryptoJS from 'crypto-js';
import { Checkbox, Alert, Select, Form, Icon, message } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Option, OptGroup } = Select;
const { Tab, UserName, Password, Submit } = Login;
const FormItem = Form.Item;

@Form.create()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends PureComponent {
  state = {
    type: 'account',
    autoLogin: true,
    data: [],
    dataByName: [],
    orgId: undefined,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type, orgId } = this.state;
    const tempValues = values;
    if (!err) {
      tempValues.loginPswd = CryptoJS.MD5(values.loginPswd).toString();
      tempValues.orgId = orgId;
      if(tempValues.orgId === undefined) return message.error("请输入商户号或组织名称");
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...tempValues,
          sysId: 'damai-admin',
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  
  handleSearch = value => {
    if (value === '' || value === undefined) {
      return; 
    }
      this.searchByOrgCode(value);
      
  } 

  searchByOrgCode =  value =>{
    const data = [];
    
    this.props.dispatch({
      type: 'login/listByOrgCode',
      payload: {
        orgCode: value
      },
      callback: (record) => {
        record.forEach(r => {
          data.push({
            value: r.id,
            text: r.orgCode
          });
        });
        this.searchByOrgName(value,data);
      }
    });
  }
  searchByOrgName = (value,data) =>{
    const dataByName = [];
    this.props.dispatch({
      type: 'login/listByName',
      payload: {
        name: value
      },
      callback: (record) => {
        record.forEach(r => {
          dataByName.push({
            value: r.id,
            text: r.name
          });
        });
        this.setState({ dataByName,data });
      }
    });
  }

  handleChange = value => {
    this.setState({ orgId: value });
  };

  render() {
    const { login, submitting, form } = this.props;
    const { type } = this.state;
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    const optionsByName = this.state.dataByName.map(d => <Option key={d.value}>{d.text}</Option>);
    const userNameRules = {
      rules: [
        {
          required: true,
          message: '请输入email/手机号/登录名称!',
        },
      ],
    };
    const loginPswdRules = {
      rules: [
        {
          required: true,
          message: '请输入登录密码!',
        },
      ],
    };
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {login.status !== 1 && login.type === 'account' && !submitting && this.renderMessage(login.msg)}
            <FormItem>
              <Select
                showSearch
                placeholder="请输入商户号或组织名称"
                size="large"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
              >
                <OptGroup label="商户号">
                  {options}
                </OptGroup>
                <OptGroup label="组织名称">
                  {optionsByName}
                </OptGroup>
              </Select>
              </FormItem>
            <UserName name="userName" placeholder="email/手机号/登录名称" {...userNameRules} />
            <Password name="loginPswd" placeholder="登录密码" {...loginPswdRules} />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
