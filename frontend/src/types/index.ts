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
    start_time: string;
    end_time: string;
    location: string;
    max_members: number;
    additional_members: number;
    registration_count: number;
    media_url: string;
    created_at: string;
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