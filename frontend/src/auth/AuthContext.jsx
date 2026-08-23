import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    login as apiLogin,
    logout as apiLogout,
    getCurrentUser
} from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function restoreAuthentication() {
            try {
                const userData = await getCurrentUser();

                if (userData) {
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        restoreAuthentication();
    }, []);

    const login = async (email, password) => {
        setLoading(true);

        try {
            await apiLogin(email, password);

            const userData = await getCurrentUser();
            setUser(userData);

            return userData;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}