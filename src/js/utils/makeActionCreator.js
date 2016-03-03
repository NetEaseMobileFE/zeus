/**
 * Created by jruif on 16/2/26.
 */

export default function makeActionCreator(type, ...argNames) {
  return (...args) => {
    let action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}
