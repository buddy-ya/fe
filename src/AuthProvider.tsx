import { useEffect, useState } from "react";
import { getAccessToken } from "./utils/service/auth";
import { API } from "./api";

interface Props {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {

    const [loading, setLoading] = useState(false);

    const initAuth = async () => {
        setLoading(true);
        const accessToken = await getAccessToken();
        if (accessToken) {
            API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
        setLoading(false);
    }

    useEffect(() => {
        initAuth();
    }, [])

    if (loading) return <></>;
    return <>{children}</>
}