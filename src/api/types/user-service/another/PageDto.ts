export interface PageDto<T> {
    content: T[]
    page: number
    size: number
    has_next: boolean
}
