export const setPending = (state: { loading: boolean; error: string | null }) => {
    state.loading = true;
    state.error = null;
};

export const setRejected = (state: { loading: boolean; error: string | null }, action: any) => {
    state.loading = false;
    state.error = action.payload as string;
};

export const handleApiError = (error: any, defaultMessage: string): string => {
    return error.response?.data?.message || defaultMessage;
};