import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import extend from 'lodash.assign';

import styles from '../../../css/modules/detail.scss';
import STATE_MAP from './state';
import moment from 'moment';
import Pagination from '../common/Pagination';
import { loadParticipants, searchParticipants, clearSearchResults, deleteParticipant, fetchParticipantsCount, changeParticipantsPage, expandInfo, editInfo, saveInfo } from '../../actions/detail';

@CSSModules(styles, {
  allowMultiple: true
})
export default class Participants extends Component {
  constructor(props) {
    super(props);
    this.tempInfo = {};
    this.RECORDES_PER_PAGE = 10;
    this.handleEditBlur = this.handleEditBlur.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleChangePageClick = this.handleChangePageClick.bind(this);
  }
  componentDidMount() {
    // 清空临时信息
    this.tempInfo = {};
    const { id, participants, loadParticipants, fetchParticipantsCount } = this.props;
    if (participants.length === 0) {
      loadParticipants(id);
      fetchParticipantsCount(id);
    }
  }

  // 查询
  handleSearchClick() {
    const value = this.refs.searchInput.value.trim();
    if (!value) {
      return;
    }
    this.props.searchParticipants(this.props.id, value).then((json) => {
      if (!json.data || json.data.length === 0){
        alert('未找到搜索结果');
      }
      this.props.changeParticipantsPage(1, this.RECORDES_PER_PAGE);
    })
  }
  // 清除查询结果
  handleClearClick() {
    this.props.clearSearchResults();
    this.refs.searchInput.value = '';
  }
  // 翻页
  handleChangePageClick(next){
    this.props.changeParticipantsPage(next, this.RECORDES_PER_PAGE);
  }
  handleEditBlur(event) {
    let value = event.target.value;
    const key = event.target.dataset.key;
    if (!key) {
      return;
    }
    if (event.target.type === 'date') {
      value = +new Date(value);
    }
    if (value !== this.tempInfo[key]) {
      extend(this.tempInfo, { [key]: value });
    }
  }

  // 编辑报名人信息
  handleEditClick(id, index) {
    const { editInfo, participants, expandInfo } = this.props;
    expandInfo(id);
    editInfo(id);
  }
  handleSaveClick(id, cancel) {
    const { editInfo, saveInfo } = this.props;
    editInfo(0);
    if (!cancel) {
      saveInfo(id, this.tempInfo);
    }
    this.tempInfo = {};
  }

  // 展开报名人信息
  handleExpandClick(id) {
    if (id === this.props.expandId) {
      this.props.expandInfo(0);
    } else {
      this.props.expandInfo(id);  
    }
  }

  // 删除报名人信息
  handleDeleteClick(id) {
    const value = confirm('是否取消此用户报名？')
    value && this.props.deleteParticipant(this.props.id, id);
  }
  render() {
    const { editId, detail, expandId, showResult, participants, current, count } = this.props;
    if (participants.length > 0) {
      return (
        <form styleName="joiner" onBlur={this.handleEditBlur}>
          <h2>报名用户管理</h2>
          <div styleName="row search-area">
            <div styleName="shrink columns">
              <a styleName="button disabled">下载报名信息</a>
            </div>
            <div styleName="large-2 columns">
              <input styleName="input" ref="searchInput" type="text" placeholder="输入姓名或电话查询" />
            </div>
            <div styleName="columns shrink">
              <a styleName="button" onClick={this.handleSearchClick}>搜索</a>  
            </div>
            {
              showResult && <div styleName="columns"><a styleName="button" onClick={this.handleClearClick}>返回全部</a></div>
            }
          </div>       
          <div>
            {
              participants.slice((current - 1) * this.RECORDES_PER_PAGE, current * this.RECORDES_PER_PAGE).map((person, i) => {
                const edit = +person.id === editId;
                const expand = expandId === +person.id;
                return (
                  <div data-id={person.id} styleName={'row item align-middle' + (expand ? ' callout secondary' : '')} key={person.id}>
                    <div styleName="medium-10 columns">
                      <div styleName="row align-middle">
                        <div styleName="text-center hollow secondary" onClick={this.handleExpandClick.bind(this, person.id)}>{expand ? '↑' : '↓'}</div>
                        <div styleName="columns">
                          <label>姓名： 
                            <input type="text" data-key="name" readOnly={!edit} defaultValue={person.name} />
                          </label>
                        </div>
                        <div styleName="columns small-1">
                          <label>性别： 
                            <select disabled={!edit} defaultValue={person.sex} data-key="sex">
                              <option value="0">男</option>
                              <option value="1">女</option>
                            </select> 
                          </label>
                        </div>
                        <div styleName="columns">
                          <label>联系电话： 
                            <input type="text" data-key="phoneNum" readOnly={!edit} defaultValue={person.phoneNum} />
                          </label>
                        </div>
                        <div styleName="columns">
                          <label>报名项目： 
                            <input type="text" data-key="productName" readOnly={!edit} defaultValue={person.productName} />
                          </label>
                        </div>
                        <div styleName="columns small-2"><span styleName="label">{STATE_MAP[person.state]}</span></div>
                      </div>
                      {
                        expand && (
                          <div styleName="columns">
                            <div styleName="row">
                              <div styleName="columns">
                                <label>出生年月： 
                                  <input type="date" data-key="birthday" readOnly={!edit} defaultValue={moment(person.birthday).format('YYYY-MM-DD')} />
                                </label>
                              </div>
                              <div styleName="columns">
                                <label>身份证号： 
                                  <input type="text" data-key="idCard" readOnly={!edit} defaultValue={person.idCard} />
                                </label>
                              </div>
                              <div styleName="columns">
                                <label>电子邮箱： 
                                  <input type="email" data-key="eMail" readOnly={!edit} defaultValue={person.eMail} />
                                </label>
                              </div>
                            </div>
                            <div styleName="row">
                              <div styleName="columns">
                                <label>收货地址： 
                                  <textarea row="2" data-key="address" readOnly={!edit} defaultValue={person.address}></textarea> 
                                </label>
                              </div>
                            </div>
                            <div styleName="row">
                              <div styleName="columns">
                                <label>身高： 
                                  <input type="number" placeholder="cm." data-key="height" readOnly={!edit} defaultValue={person.height} />
                                </label>
                              </div>
                              <div styleName="columns">
                                <label>体重： 
                                  <input type="number" placeholder="kg." data-key="weight" readOnly={!edit} defaultValue={person.weight} />
                                </label>
                              </div>
                              <div styleName="columns">
                                <label>衣服尺码： 
                                  <select disabled={!edit} defaultValue={person.dressSize} data-key="dressSize">
                                    <option value="0">S</option>
                                    <option value="1">M</option>
                                    <option value="2">L</option>
                                    <option value="3">XL</option>
                                    <option value="4">XXL</option>
                                    <option value="5">XXXL</option>
                                  </select> 
                                </label>
                              </div>
                              <div styleName="columns">
                                <label>跑鞋尺码： 
                                  <input type="text" data-key="shoesSize" readOnly={!edit} defaultValue={person.shoesSize} />
                                </label>
                              </div>
                            </div>
                            <div styleName="row">
                              <div styleName="columns">
                                <label>紧急联系人姓名： 
                                  <input type="text" data-key="emergencyName" readOnly={!edit} defaultValue={person.emergencyName} />
                                </label>
                              </div>
                              <div styleName="columns">
                                <label>紧急联系人电话： 
                                  <input type="text" data-key="emergencyPhone" readOnly={!edit} defaultValue={person.emergencyPhone} />
                                </label>
                              </div>
                            </div>
                            <div styleName="row">
                              <div styleName="columns">
                                <label>备注：
                                  <textarea row="2" data-key="note" readOnly={!edit} defaultValue={person.note}></textarea> 
                                </label>
                              </div>
                            </div>
                            <div styleName="row">
                              <div styleName="columns">
                                <label>参加过马拉松： 
                                  <input type="text" data-key="takePartName" readOnly={!edit} defaultValue={person.takePartName} />
                                </label>
                              </div>
                              <div styleName="columns">
                                <label>报名时间： 
                                  <input type="date" data-key="createTime" readOnly={!edit} defaultValue={moment(person.createTime).format('YYYY-MM-DD')} />
                                </label>
                              </div>
                            </div>
                          </div>
                            
                        )
                      }

                    </div>
                    {
                      detail.state === 7 ?
                        (<div styleName="medium-2 row">
                          {
                            !edit ? <a styleName={'columns large-4 button warning' + (person.state === 10 ? ' disabled' : '')} onClick={this.handleEditClick.bind(this, person.id, i)}>编辑</a> : <a styleName="button success" onClick={this.handleSaveClick.bind(this, person.id, false)}>保存</a>
                          }
                          {
                            !edit ? <a styleName={'columns large-4 button alert' + (person.state === 10 ? ' disabled' : '')} onClick={this.handleDeleteClick.bind(this, person.id)}>删除</a> : <a styleName="button" onClick={this.handleSaveClick.bind(this, person.id, true)}>取消</a>
                          }
                        </div>)
                      :
                        (<div styleName="medium-2 row">
                          <label styleName="columns">成绩： 
                            <input type="time" data-key="score" readOnly={!edit} defaultValue={moment(person.score || 0).format('hh:mm:ss')} />
                          </label>
                          <a styleName="button success">保存</a>
                        </div>)
                    }
                  </div>
                );
              })
            }
            <Pagination recordsPerPage={this.RECORDES_PER_PAGE} total={Math.ceil(count / this.RECORDES_PER_PAGE)} curPage={current} toPage={this.handleChangePageClick} />

          </div>
          
          
        </form>
      );
    }
    return (<div />);
  }
}
Participants.propTypes = {
  count: PropTypes.number.isRequired, 
  editId: PropTypes.number.isRequired, 
  detail: PropTypes.object.isRequired,
  current: PropTypes.number.isRequired, 
  expandId: PropTypes.number.isRequired, 
  participants: PropTypes.array.isRequired, 
  saveInfo: PropTypes.func.isRequired, 
  editInfo: PropTypes.func.isRequired, 
  expandInfo: PropTypes.func.isRequired, 
  loadParticipants: PropTypes.func.isRequired, 
  changeParticipantsPage: PropTypes.func.isRequired,
  fetchParticipantsCount: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
  const { id, detail } = props;
  let count = 0;
  let editId = 0;
  let current = 1;
  let expandId = 0;
  let participants = [];
  const searchResults = state.participants.searchResults;
  const showResult = searchResults.length > 0;
  if (+id === +state.participants.id) {
    participants = state.participants.data || [];
    current = state.participants.current;
    count = state.participants.count;
    expandId = +state.participants.expandId;
    editId = +state.participants.editId;
    if (showResult) {
      participants = searchResults;
      count = searchResults.length;
    }
  }
  return {
    id,
    count,
    detail,
    editId,
    current,
    expandId,
    showResult,
    participants,
  };
}

export default connect(mapStateToProps, { 
  saveInfo, 
  editInfo, 
  expandInfo, 
  loadParticipants, 
  deleteParticipant,
  clearSearchResults,
  searchParticipants,
  fetchParticipantsCount,
  changeParticipantsPage,
})(Participants);
