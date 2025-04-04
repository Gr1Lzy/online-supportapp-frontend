import {UserResponseDto} from "../../user-service/users/UserResponseDto.ts";

export interface CommentResponseDto {
    text: string
    user: UserResponseDto
    created_date: string
}