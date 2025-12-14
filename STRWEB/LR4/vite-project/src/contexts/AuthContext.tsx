import { createContext } from "react";
import type { AuthContextType, User } from "../hooks/authUtils";

export const AuthContext = createContext<AuthContextType | null>(null);
export type { AuthContextType, User };
