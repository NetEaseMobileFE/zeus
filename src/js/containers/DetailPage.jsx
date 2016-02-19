/**
 * Created by jruif on 16/2/2.
 * 活动详情
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import CSSModules from 'react-css-modules';
import styles from '../../css/modules/detail.scss';

import { loadDetail, toggleBill, loadParticipants, fetchJoinersCount, changeJoinersPage, loadInviteCodes, expandInfo, editInfo, saveInfo, updateTempInfo, fetchCodesCount, genCode, changeCodesPage } from '../actions/detail';

import { Participant, Activity, InviteCode } from '../components/detail';
@CSSModules(styles, {
  allowMultiple: true
})
class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.handleModifyClick = this.handleModifyClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.expandJoiner = this.expandJoiner.bind(this);
    this.viewJoiners = this.viewJoiners.bind(this);
    this.editJoiner = this.editJoiner.bind(this);
    this.deleteJoiner = this.deleteJoiner.bind(this);
    this.blurJoiner = this.blurJoiner.bind(this);
    this.genCode = this.genCode.bind(this);
    this.changeCodesPage = this.changeCodesPage.bind(this);
    this.changeJoinersPage = this.changeJoinersPage.bind(this);
  }
  componentDidMount() {
    this.props.loadDetail(this.props.params.id);
    this.props.loadInviteCodes(this.props.params.id);
    this.props.fetchCodesCount(this.props.params.id);
  }
  handleModifyClick() {

  }
  handleCancelClick() {

  }

  // 生成邀请码
  genCode(data){
    this.props.genCode({
      cid: this.props.detail.id,
      productName: data.split('|')[0],
      productPrice: data.split('|')[1]
    });
  }

  // 邀请码翻页
  changeCodesPage(next) {
    this.props.changeCodesPage(next, 2);
  }

  // 展开报名人信息
  expandJoiner(id) {
    if (id === this.props.expandId ) {
      this.props.expandInfo('');
    } else {
      this.props.expandInfo(id);  
    }
  }
  // 获取报名人信息
  viewJoiners() {
    const { participants, loadParticipants, fetchJoinersCount} = this.props;
    if (participants.length === 0) {
      loadParticipants(this.props.params.id);
      fetchJoinersCount(this.props.params.id);
    }
  }

  // 编辑报名人信息
  editJoiner(id, index) {
    this.expandJoiner(id);
    this.props.editInfo(id);
    this.props.updateTempInfo(this.props.participants[index]);
  }
  blurJoiner(event) {
    const value = event.target.value;
    const key = event.target.dataset.key;
    if (value !== this.props.tempInfo[key]) {
      this.props.updateTempInfo({
        [key]: value
      })
    }
  }
  saveJoiner(id, cancel) {
    const { tempInfo, editInfo, updateTempInfo, saveInfo } = this.props;
    editInfo('');
    if (!cancel){
      saveInfo(id, tempInfo);
    }
    updateTempInfo({});
  }
  // 删除报名人信息
  deleteJoiner(id) {

  }
  // 报名人信息翻页
  changeJoinersPage(next) {
    this.props.changeJoinersPage(next, 2);
  }

  render() {
    const { id } = this.props.params;
    const { 
      bill,
      detail, 
      editId, 
      showBill,
      expandId, 
      codesCount, 
      toggleBill,
      inviteCodes, 
      joinersCount,
      participants, 
      joinersCurrent,
      inviteCodesCurrent, 
    } = this.props;
    return (
      <div >
        <Activity detail={detail} showBill={showBill} bill={bill} handleViewBillClick={toggleBill} handleViewJoinersClick={this.viewJoiners.bind(this)} handleBillClick={toggleBill} />
        <InviteCode 
          detail={detail} 
          inviteCodes={inviteCodes} 
          current={inviteCodesCurrent} 
          handleGenCodeClick={this.genCode.bind(this)} 
          toPage={this.changeCodesPage.bind(this)}
          count={codesCount}
        />
        <Participant 
          participants={participants}
          toPage={this.changeJoinersPage.bind(this)}
          current={joinersCurrent} 
          count={joinersCount} 
          editId={editId}
          expandId={expandId}
          handleEditBlur={this.blurJoiner.bind(this)}
          handleExpandClick={this.expandJoiner.bind(this)} 
          handleEditClick={this.editJoiner.bind(this)} 
          handleDeleteClick={this.deleteJoiner.bind(this)} 
          handleSaveClick={this.saveJoiner.bind(this)}
        />
      </div>
    );
  }
}
DetailPage.propTypes = {
  params: PropTypes.object.isRequired
};

function mapStateToProps(state, props) {
  const { id } = props.params;
  const detail = state.details[id] || {};
  const showBill = state.details.showBill;
  const bill = state.details.bill;
  let participants = [];
  let inviteCodes = [];
  let inviteCodesCurrent = 0;
  let codesCount = 0;
  let joinersCurrent = 0;
  let joinersCount = 0;
  let expandId = '';
  let editId = '';
  let tempInfo = {};


  if (+id === +state.inviteCodes.id) {
    inviteCodes = state.inviteCodes.data || [];
    inviteCodesCurrent = state.inviteCodes.current;
    codesCount = state.inviteCodes.count;
  }
  if (+id === +state.participants.id) {
    participants = state.participants.data || [];
    joinersCurrent = state.participants.current;
    joinersCount = state.participants.count;
    expandId = state.participants.expandId || '';
    editId = state.participants.editId || '';
    tempInfo = state.participants.tempInfo || {};
  }
  return {
    inviteCodesCurrent,
    joinersCurrent,
    joinersCount,
    participants,
    inviteCodes,
    codesCount,
    tempInfo,
    expandId,
    showBill,
    detail,
    editId,
    bill,
  }
}

// export default DetailPage;
export default connect(mapStateToProps, { 
  changeJoinersPage,
  fetchJoinersCount,
  loadParticipants, 
  loadInviteCodes, 
  changeCodesPage,
  fetchCodesCount,
  updateTempInfo, 
  loadDetail, 
  toggleBill,
  expandInfo, 
  editInfo, 
  saveInfo, 
  genCode 
})(DetailPage);
