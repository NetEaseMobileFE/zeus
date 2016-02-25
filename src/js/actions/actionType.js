/**
 * Created by jruif on 16/2/2.
 *
 * 类型配置文件
 * 建议,app中用的到 字符串常量 都应该存放于此
 */

export const LOGIN = 'LOGIN';               // 登录信息
export const ERROR = 'ERROR';               // 出错
export const REQUEST = 'REQUEST';           // 发送请求
export const RECEIVE = 'RECEIVE';           // 收到请求
export const SUCCESS = 'SUCCESS';           // 出错
export const MODAL_OK = 'MODAL_OK';         // 弹窗动作 确定
export const MODAL_CANCEL = 'MODAL_CANCEL'; // 弹窗动作 取消
export const LOADING_START = 'LOADING_START'; // 显示loading动画
export const LOADING_ENDED = 'LOADING_ENDED'; // 结束loading动画

export const REQUEST_DETAIL = 'REQUEST_DETAIL'; // 请求活动详情
export const TOGGLE_BILL = 'TOGGLE_BILL'; // 查看账单
export const REQUEST_BILL = 'REQUEST_BILL'; // 获取账单信息
export const REQUEST_CODES = 'REQUEST_CODES'; // 获取邀请码
export const REQUEST_CODES_COUNT = 'REQUEST_CODES_COUNT'; // 获取邀请码总数
export const GENERATE_CODE = 'GENERATE_CODE'; // 请求邀请码
export const SHOW_CODES = 'SHOW_CODES'; // 请求邀请码
export const REQUEST_PARTICIPANTS = 'REQUEST_PARTICIPANTS'; // 请求活动参与人
export const REQUEST_PARTICIPANTS_COUNT = 'REQUEST_PARTICIPANTS_COUNT'; // 请求活动参与人总数
export const SEARCH_PARTICIPANTS = 'SEARCH_PARTICIPANTS'; // 搜索报名人
export const CLEAR_RESULTS = 'CLEAR_RESULTS'; // 清除搜索内容
export const DELETE_PARTICIPANT = 'DELETE_PARTICIPANT'; // 删除报名人
export const SHOW_PARTICIPANTS = 'SHOW_PARTICIPANTS'; // 活动参与人分页
export const EXPAND_INFO = 'EXPAND_INFO'; // 展开报名人信息
export const EDIT_INFO = 'EDIT_INFO'; // 编辑报名人信息
export const SAVE_INFO = 'SAVE_INFO'; // 保存报名人信息

// 首页
export const UPDATE_APP_LIST = "UPDATE_APP_LIST";
export const UPDATE_LIST_PAGINATION = "UPDATE_LIST_PAGINATION";
export const UPDATE_LIST_PARAM = "UPDATE_LIST_PARAM";

// 创建表单
export const ADD_ITEM = 'ADD_ITEM';     // 添加 子元素
export const REMOVE_ITEM = 'REMOVE_ITEM'; // 移除 子元素
export const UPDATE_ITEM = 'UPDATE_ITEM'; // 更新 子元素
export const UPDATE_FORM = 'UPDATE_FORM'; // 更新 表单
export const RESET = 'RESET'; // 更新 表单
export const MODIFICATION_INIT = 'MODIFICATION_INIT'; // 修改 活动初始化

// 管理员
export const REQUEST_USERS = 'REQUEST_USERS'; //请求用户s
export const REQUEST_USERS_COUNT = 'REQUEST_USERS_COUNT'; //请求用户总数
export const SHOW_USERS = 'SHOW_USERS'; // 用户分页
export const ADD_USER = 'ADD_USER'; // 增加用户
export const MODIFY_USER = 'MODIFY_USER'; // 修改用户
export const DELETE_USER = 'DELETE_USER'; // 删除用户
export const TOGGLE_MODAL = 'TOGGLE_MODAL'; // 显示或隐藏对话框
