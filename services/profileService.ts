import { Staff } from "@/entities/Staff"
import AxiosService from "./axios_service"

const getProfile = () => {
    return AxiosService.get<Staff>("/api/staffs/0")
}

const ProfileService = {
    getProfile
}

export default ProfileService