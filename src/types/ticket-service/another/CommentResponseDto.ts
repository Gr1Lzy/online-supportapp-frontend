import {UserResponseDto} from "../../user-service/users/UserResponseDto.ts";

export interface CommentResponseDto {
    text: string
    author: UserResponseDto
    created_date: string
}