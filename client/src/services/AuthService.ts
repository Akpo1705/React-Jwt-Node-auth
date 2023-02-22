import $api from "../http"
import { AxiosResponse } from "axios"
import { AuthResponse } from "../models/response/AuthResponse"
export default class AuthService {
        static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>>{
                return (await $api.post('/api/login', {email,password}))
        }
        static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>>{
                return (await $api.post('/api/registration', {email,password}))
        }
        static async logout(): Promise<void>{
                return (await $api.get('/api/logout'))
        }

}