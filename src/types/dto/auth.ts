export interface AuthRequestDto {
    username: string
    password: string
}

export interface AuthResponseDto {
    token_type: string
    access_token: string
    refresh_token: string
    expires_in: number
}

export interface RefreshRequestDto {
    refresh_token: string
}

export interface PasswordRequestDto {
    password: string
}