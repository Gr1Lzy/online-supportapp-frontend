import {UserResponseDto} from "../../user-service/users/UserResponseDto.ts";

export interface LogResponseDto {
    action: string
    action_by: UserResponseDto
    action_date: string
}