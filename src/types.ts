export interface User { login: string; name: string | null; avatarUrl: string; url: string; vercelConfigured: boolean }
export interface Repo { id: number; name: string; fullName: string; owner: string; description: string | null; private: boolean; defaultBranch: string; url: string; updatedAt: string; canDelete: boolean }
export interface VProject { id: string; name: string; framework: string | null; repo: string | null }
export interface VDeployment { id: string; name: string; url: string; state: string; createdAt: number; branch: string | null; target: string | null }
