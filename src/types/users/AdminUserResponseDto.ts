export interface AdminUserResponseDto {
    id: string
    username: string
    email: string
    first_name: string | null
    last_name: string | null
    roles: string[]
}