import React, {Component} from 'react';
import {NavBar, Icon} from 'antd-mobile';
import createHashHistory from 'history/createHashHistory';
import PublicService from '../../services/PubliceService';
import dsbridge from 'dsbridge';
import './index.less';
import {withRouter} from 'react-router-dom';

const history = createHashHistory();

class navBar extends Component {

  // 返回
  handleClick() {
    if (this.props.leftType === 'cross') {
      this.props.handleLeft();
    }
    if (this.props.isShow) {
      if (localStorage.getItem('applicationType') === 'app') {
        dsbridge.call('goBackFromH5', 'goBackFromH5');
        PublicService.setupWebViewJavascriptBridge((bridge) => {
          bridge.callHandler('goBackFromH5');
        });
      } else {
        history.push('/login');
      }

    } else {
      if (this.props.goBack) {
        this.props.goBack();
        return;
      }
      const paths = this.props.history.location.pathname ? this.props.history.location.pathname.split('/') : [];
      console.log(paths);
      if (paths.length > 1) {
        paths.pop();
      }
      const pathStr = paths.join('/');
      history.push(pathStr);
    }
  }

  render() {
    const {title, leftType} = this.props;
    return (
      <NavBar
        className='cloud-navbar'
        mode="light"
        icon={<Icon type={leftType || 'left'}/>}
        onLeftClick={this.handleClick.bind(this)}
        rightContent={this.props.isRightAddIcon ? [
          <i key='1' onClick={this.props.onAddHandle} className='iconfont cloud-icon-icn_home_head_add_nor_x'/>,
        ] : (this.props.isRightOperate ? [<span key='1' onClick={this.props.onHandleOperate}
                                                className={`cloud-navbar--text ${this.props.operateContent.className}`}>{this.props.operateContent.text}</span>] : [])}
      >
        <div className='cloud-navbar__title'>{title || '首页'}</div>
      </NavBar>
    );
  }
}


export default withRouter(navBar);
