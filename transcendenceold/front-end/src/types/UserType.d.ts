export interface UserType {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    isOnLine: boolean;
    Status: string;
    levelGame: number;
    twoFactor: boolean;
    qrCodeFileName: string;
    towFactorToRedirect: boolean;
}
