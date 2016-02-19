import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from '../../../css/modules/detail.scss';

import Pagination from '../common/Pagination';

@CSSModules(styles, {
  allowMultiple: true
})
export default class Participant extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { editId, expandId, participants, handleExpandClick, handleEditClick, handleDeleteClick, handleSaveClick, handleEditBlur, current, count, toPage } = this.props;
    if (participants.length > 0) {
      return (
        <form onBlur={handleEditBlur}>
          <h2>报名用户管理</h2>
          <div styleName="row">
            <div styleName="shrink columns">
              <a styleName="button">下载报名信息</a>
            </div>
            <div styleName="large-2 columns">
              <input styleName="input" type="text" />
            </div>
            <div styleName="columns">
              <a styleName="button">搜索</a>  
            </div>
          </div>       
          <div>
            {
              participants.slice((current - 1) * 2, current * 2).map((person, i) => {
                console.log(person.id)
                const edit = person.id === editId;
                const expand = expandId === person.id;
                return (
                  <div styleName={"row align-middle" + (expand ? " callout secondary" : "")} key={i}>
                    <div styleName="medium-10 columns">
                      <div styleName="row align-middle">
                        <div styleName="text-center hollow secondary" onClick={handleExpandClick.bind(null, person.id)}>{expand ? '↑' : '↓'}</div>
                        <div styleName="columns">
                          <label>姓名： 
                            <input type="text" data-key="name" readOnly={!edit} defaultValue={person.name} />
                          </label>
                        </div>
                        <div styleName="columns">
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
                        <div styleName="columns"><span styleName="label">{person.state}</span></div>
                      </div>
                      {
                        expand && (
                          <div styleName="columns">
                            <div styleName="row">
                              <div styleName="columns">
                                <label>出生年月： 
                                  <input type="date" data-key="birthday" readOnly={!edit} defaultValue={person.birthday} />
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
                                  <input type="text" data-key="dressSize" readOnly={!edit} defaultValue={person.dressSize} />
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
                                  <input type="date" data-key="createTime" readOnly={!edit} defaultValue={person.createTime} />
                                </label>
                              </div>
                            </div>
                          </div>
                            
                        )
                      }

                    </div>
                    <div styleName="medium-2 row">
                      <div styleName="medium-6">
                      {
                        !edit ? <a styleName="button warning" onClick={handleEditClick.bind(null, person.id, i)}>编辑</a> : <a styleName="button success" onClick={handleSaveClick.bind(this, person.id, false)}>保存</a>
                      }
                      </div>
                      <div styleName="medium-6">
                      {
                        !edit ? <a styleName="button alert" onClick={handleDeleteClick.bind(null, person.id)}>删除</a> : <a styleName="button" onClick={handleSaveClick.bind(this, person.id, true)}>取消</a>
                      }
                      </div>
                    </div>
                  </div>
                )
              })
            }
            <Pagination total={Math.ceil(count / 2)} curPage={current} toPage={toPage} />

          </div>
          
          
        </form>
      )
    }
    return (<div />);
  }
}
