import {UserResponseDto} from "./users.ts";
import {TicketStatus} from "./common.ts";

export interface LogResponseDto {
    action: string
    action_by: UserResponseDto
    action_date: string
}

export interface UserIdRequestDto {
    userId: string;
}

export interface CommentResponseDto {
    text: string
    author: UserResponseDto
    created_date: string
}

export interface TicketRequestDto {
    title: string
    description: string
    assignee_id?: string
}

export interface TicketResponseDto {
    id: string
    title: string
    description: string
    assignee: UserResponseDto
    reporter: UserResponseDto
    status: TicketStatus
    comments: CommentResponseDto[]
    logs: LogResponseDto[]
    created_at: string
    updated_at: string
}