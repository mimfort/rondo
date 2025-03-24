import React from 'react';
import { Tag } from '../types';

interface EventTagsProps {
    tags: (Tag | string)[];
    isAdmin?: boolean;
    eventId?: number;
    showControls?: boolean;
}

const EventTags: React.FC<EventTagsProps> = ({ tags = [], isAdmin = false, showControls = false }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
                const tagId = typeof tag === 'string' ? index : tag.id;
                const tagName = typeof tag === 'string' ? tag : tag.name;

                return (
                    <div
                        key={tagId}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                        {tagName}
                    </div>
                );
            })}
            {tags.length === 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Нет тегов
                </span>
            )}
        </div>
    );
};

export default EventTags; 