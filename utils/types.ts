export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    public_flags: number;
    flags: number;
    locale: string;
    mfa_enabled: boolean;
    email: string;
    verified: boolean;
    banner: string;
}

export interface DiscordGuild {
    id: string;
    name: string;
    icon: string;
    icon_hash: string;
    splash: string;
    discovery_splash: string;
    owner: boolean;
    owner_id: string;
    permissions: string;
    region: string;
    afk_channel_id: string;
    afk_timeout: number;
    widget_enabled: boolean;
    widget_channel_id: string;
    verification_level: number;
    default_message_notifications: number;
    explicit_content_filter: number;
    roles: any[];
    emojis: any[];
    features: string[];
    mfa_level: number;
    application_id: string;
    system_channel_id: string;
    system_channel_flags: number;
    rules_channel_id: string;
    max_presences: number;
    max_members: number;
    vanity_url_code: string;
    description: string;
    banner: string;
    premium_tier: number;
    premium_subscription_count: number;
    preferred_locale: string;
    public_updates_channel_id: string;
    max_video_channel_users: number;
    approximate_member_count: number;
    approximate_presence_count: number;
    welcome_screen: any;
    nsfw_level: number;
    sticker_items: any[];
    premium_progress_bar_enabled: boolean;
}

export interface User {
    me: DiscordUser;
    guilds: DiscordGuild[];
}

export interface NavBarProps {
    user: DiscordUser;
    redirectRoute?: string;
}

export interface Props {
    user: DiscordUser;
    bots: Bot[];
}

export interface Bot {
    botId: string;
    prefix: string;
    ownerId: string;
    verified: boolean;
    supportInvite: string;
    site: string;
    description: string;
    likes: number;
    latestLikeDate: Date;
    team: string[];
    checked: boolean;
    avatar: string;
    username: string;
    serverCount: number;
    userCount: number;
    shardCount: number;
    latestsStastsUpdate: Date;
    tags: string[];
    voteHook: string;
    hookCode: string;
}

export interface DBUser {
    userId: string;
    avis: string;
    cmdbl: boolean;
    ticketsbl: boolean;
    warns: Warn[];
    totalNumbers: number;
    readFaq: boolean;
    locale: string;
    lastVoteDate: number;
    badges: Badge[];
}

export interface Badge {
    id: BadgeId;
    acquired: boolean;
}

export enum BadgeId {
    DEV = "dev",
    PARTNER = "partner",
    PREMIUM = "premium",
    STAFF = "staff",
    SUPPORT = "support",
    VERIFICATOR = "verificator"
}

export interface Warn {
    id: number;
    userId: string;
    modId: string;
    type: string;
    reason: string;
    duration: number;
    finishOn: number;
    date: number;
    deleted: boolean;
    historyLogs: HistoryLog[];
}

export interface HistoryLog {
    title: string;
    mod: string;
    date: number;
}