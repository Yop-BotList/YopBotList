export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    public_flags: number;
    flags: number;
    locale: string;
    mfa_enabled: boolean;
    premium_type: number;
    email: string;
    verified: boolean;
}