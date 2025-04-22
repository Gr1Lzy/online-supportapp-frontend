export interface AdminUserResponseDto {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    roles: string[]
}

export interface UserCreateRequestDto {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
}

export interface UserResponseDto {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    roles?: string[]
}

export interface UserUpdateRequestDto {
    email?: string;
    first_name?: string;
    last_name?: string;
}