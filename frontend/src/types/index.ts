export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    start_time: string;
    location: string;
    max_members: number;
    registration_count: number;
    available_spots: number;
    total_spots: number;
}

export interface Registration {
    id: number;
    event: Event;
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
    media_url: string;
    max_members: number;
    location: string;
    start_time: string;
    end_time: string;
} 