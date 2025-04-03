export interface UserResponseDto {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface UserCreateRequestDto {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

export interface AdminUserResponseDto {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
}


export interface UserUpdateRequestDto {
    email: string;
    first_name: string;
    last_name: string;
}
