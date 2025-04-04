import {UserResponseDto} from "../../user-service/users/UserResponseDto.ts";
import {TicketStatus} from "../status/TicketStatus.ts";
import {CommentResponseDto} from "../another/CommentResponseDto.ts";
import {LogResponseDto} from "../another/LogResponseDto.ts";

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