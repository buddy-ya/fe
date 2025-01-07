import { getAccessToken } from "./utils/service/auth";
import { API } from "./api";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {

    const initAuth = async () => {
        const accessToken = await getAccessToken();
        if (accessToken) {
            API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        }
        return accessToken || null;
    }

    const { data } = useSuspenseQuery({
        queryKey: ['auth'],
        queryFn: initAuth,
        networkMode: 'always',
    })

    return <>{children}</>
}