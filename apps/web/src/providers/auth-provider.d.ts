import React from "react";
export declare function AuthProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare const useAuthContext: () => {
    initialized: boolean;
};
