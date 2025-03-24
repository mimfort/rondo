import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../api/services';
import { Tag } from '../types';
import toast from 'react-hot-toast';
import EventTags from './EventTags';

interface AdminEventTagsProps {
    eventId: number;
    eventTags: (Tag | string)[];
}

const AdminEventTags: React.FC<AdminEventTagsProps> = ({ eventId, eventTags = [] }) => {
    const queryClient = useQueryClient();
    const [selectedTagId, setSelectedTagId] = useState<string>('');

    // Запрос на получение всех доступных тегов
    const { data: allTags } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await tagService.getAllTags();
            return response.data;
        }
    });

    // Мутация для добавления тега
    const addTagMutation = useMutation({
        mutationFn: (tagId: number) => tagService.addTagToEvent(eventId, tagId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            toast.success('Тег успешно добавлен');
            setSelectedTagId('');
        },
        onError: () => {
            toast.error('Ошибка при добавлении тега');
        }
    });

    // Мутация для удаления тега
    const removeTagMutation = useMutation({
        mutationFn: (tagId: number) => tagService.removeTagFromEvent(eventId, tagId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            toast.success('Тег успешно удален');
        },
        onError: () => {
            toast.error('Ошибка при удалении тега');
        }
    });

    const handleAddTag = () => {
        if (selectedTagId) {
            addTagMutation.mutate(Number(selectedTagId));
        }
    };

    // Фильтруем теги, которые еще не добавлены к событию
    const availableTags = allTags?.tags.filter((tag: Tag) =>
        !eventTags.some(eventTag =>
            (typeof eventTag === 'string' ? false : eventTag.id === tag.id)
        )
    ) || [];

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <select
                    value={selectedTagId}
                    onChange={(e) => setSelectedTagId(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">Выберите тег</option>
                    {availableTags.map((tag: Tag) => (
                        <option key={tag.id} value={tag.id}>
                            {tag.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAddTag}
                    disabled={!selectedTagId}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-gray-600"
                >
                    Добавить тег
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {eventTags.map((tag, index) => {
                    const tagId = typeof tag === 'string' ? index : tag.id;
                    const tagName = typeof tag === 'string' ? tag : tag.name;

                    return (
                        <div
                            key={tagId}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                        >
                            {tagName}
                            {typeof tag !== 'string' && (
                                <button
                                    onClick={() => removeTagMutation.mutate(tag.id)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    );
                })}
                {eventTags.length === 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Нет тегов
                    </span>
                )}
            </div>
        </div>
    );
};

export default AdminEventTags; 