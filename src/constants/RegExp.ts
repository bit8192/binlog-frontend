export const REG_EXP_SENSITIVE_CHAR = /(\*|\||\(|\)\$|\^|\?|{|}|\[|]|\.)/g
/**
 * 图片文件后缀
 */
export const REG_EXP_IMAGE_FILE = /\.(jpg)|(jpeg)|(png)|(webp)|(gif)/i
/**
 * markdown 标题
 */
export const REG_EXP_MARKDOWN_TITLE = /^(#+)\s(.*)$/gm
/**
 * @ 到的用户
 */
export const REG_EXP_MEMBERS = /(^|\s)@([^\s]+)($|\s)/g
/**
 * 表情标题
 */
export const REG_EXP_EXPRESSION_TITLE = /^[\w_\-\u4e00-\u9fa5]+$/
/**
 * 评论内容中的表情
 */
export const REG_EXP_COMMENT_EXPRESSION = /\[([\w_\-\u4e00-\u9fa5]+)]/g
/**
 * 用户名
 */
export const REG_EXP_USERNAME = /^[_.\-\w\u4e00-\u9fa5]{5,16}$/
/**
 * 手机号
 */
export const REG_EXP_PHONE_NUM = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
/**
 * 网址
 */
export const REG_EXP_WEBSITE = /^https?:\/\/\S+$/
