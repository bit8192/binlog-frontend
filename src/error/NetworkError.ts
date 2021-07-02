import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";

export default class NetworkError extends Error{
    axiosError: AxiosError;
    get config(): AxiosRequestConfig{
        return this.axiosError.config
    }

    get code(): string{
        return this.axiosError.code
    }

    get request(): any{
        return this.axiosError.request;
    }

    get response(): AxiosResponse{
        return this.axiosError.response;
    }

    get isAxiosError(): boolean{
        return this.axiosError.isAxiosError;
    }

    constructor(error: AxiosError) {
        super(error.message);
        this.axiosError = error;
    }
}