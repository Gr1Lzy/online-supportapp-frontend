export enum UserRole {
    ADMIN = 'ROLE_ADMIN',
    USER = 'ROLE_USER',
    SUPPORT = 'ROLE_SUPPORT'
}

export enum TicketStatus {
    OPENED = "OPENED",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED"
}

export interface PageDto<T> {
    content: T[]
    page: number
    size: number
    has_next: boolean
}

export interface RoleRequestDto {
    role: UserRole
}

export interface StatusRequestDto {
    status: TicketStatus
}