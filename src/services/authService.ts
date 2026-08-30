const TOKEN_KEY = "auth_token";

export const saveToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp) return false;
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    if (isTokenExpired(token)) {
        removeToken();
        return false;
    }

    return true;
}

export const logout = (): void => {
    removeToken();
    window.location.href = "/login";
};