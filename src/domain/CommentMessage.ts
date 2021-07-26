import Message from "@/domain/Message";

export default interface CommentMessage extends Message{
    isAgreed: boolean
}
