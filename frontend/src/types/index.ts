export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    created_at: string;
    first_name: string | null;
    last_name: string | null;
    admin_status?: string;
    is_active: boolean;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    max_members: number;
    count_members: number;
    media_url: string | null;
    created_at: string;
    updated_at: string;
    tags?: Tag[];
}

export interface Registration {
    id: number;
    user_id: number;
    event_id: number;
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

export interface Coworking {
    id: number;
    name: string;
    description: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export interface CoworkingReservation {
    id: number;
    user_id: number;
    coworking_id: number;
    coworking: Coworking;
    start_time: string;
    end_time: string | null;
    created_at: string;
    updated_at: string;
}

export interface CourtReservation {
    id: number;
    court_id: number;
    date: string;
    time: number;
    user_id: number;
    created_at: string;
    is_confirmed: boolean;
}

export interface CourtReservationsResponse {
    items: CourtReservation[];
    total: number;
} 