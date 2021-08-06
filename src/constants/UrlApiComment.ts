import {URL_BASE} from "@/constants/UrlApiCommon";

export const URL_COMMENTS = URL_BASE + "/comments";
export const URL_COMMENT_REPLIES = URL_COMMENTS + "/{commentId}/replies"
export const URL_COMMENT_SUB_REPLY = URL_COMMENTS + "/replies/{replyId}/replies"
export const URL_COMMENT_REPLY_REMOVE = URL_COMMENTS + "/replies/{replyId}"
export const URL_COMMENT_REMOVE = URL_COMMENTS + "/{commentId}"
export const URL_COMMENT_TOGGLE_AGREE = URL_COMMENTS + "/{commentId}/toggle-agree"
export const URL_COMMENT_REPLY_TOGGLE_AGREE = URL_COMMENTS + "/replies/{replyId}/toggle-agree"
export const URL_COMMENT_TOGGLE_TREAD = URL_COMMENTS + "/{commentId}/toggle-tread"
export const URL_COMMENT_REPLY_TOGGLE_TREAD = URL_COMMENTS + "/replies/{replyId}/toggle-tread"
