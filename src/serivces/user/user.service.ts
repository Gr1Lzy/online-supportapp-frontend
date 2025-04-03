import {api} from "../api";
import {UserResponseDto} from "../../types/users/UserResponseDto";


export const userService = {
    getUserById: (id: string): Promise<UserResponseDto> =>
        api.get(`/api/users/${id}`)
            .then(response => response.data),

    getUsers: (): Promise<UserResponseDto[]> =>
        api.get('/api/users')
            .then(response => response.data),

};