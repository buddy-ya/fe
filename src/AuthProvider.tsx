import { getAccessToken } from "./utils/service/auth";
import { API } from "./api";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {

    const initAuth = async () => {
        // 토큰이 있으면 API 헤더에 추가. 없으면 그냥 통과
        const accessToken = await getAccessToken();
        if (accessToken) {
            API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
        return accessToken;
    }

    const { data } = useSuspenseQuery({
        queryKey: ['auth'],
        queryFn: initAuth,
        networkMode: 'always',
    })

    return <>{children}</>
}