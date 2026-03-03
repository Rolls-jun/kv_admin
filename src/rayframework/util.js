/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s);
}

// 身份证校验
export function isCardNo(card) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(card);
}
