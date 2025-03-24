export interface User {
    id: number;
    email: string;
    username: string;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    admin_status: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    media_url: string | null;
    max_members: number;
    location: string;
    start_time: string;
    end_time: string;
    count_members: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    additional_members: number;
    tags: (Tag | string)[];
}

export interface Registration {
    id: number;
    event_id: number;
    user: User;
    status: string;
    created_at: string;
}

export interface RegistrationWithEvent extends Registration {
    event: Event;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    username: string;
    email: string;
    password: string;
}

export interface EventForm {
    title: string;
    description: string;
    max_members: number;
    location: string;
    start_time: string;
    end_time: string;
}

export interface Tag {
    id: number;
    name: string;
    description: string;
}

export interface TagCreate {
    name: string;
    description: string;
}

export interface EventTag {
    event_id: number;
    tag_id: number;
    id: number;
}

export interface EventTagCreate {
    event_id: number;
    tag_id: number;
} 