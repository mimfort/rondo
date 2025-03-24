import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../api/services';
import { Tag, TagCreate } from '../types';
import toast from 'react-hot-toast';

interface TagFormData {
    name: string;
    description: string;
}

const TagsManager = () => {
    const queryClient = useQueryClient();
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState<TagFormData>({
        name: '',
        description: ''
    });

    const { data: tagsResponse, isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await tagService.getAllTags();
            return response.data;
        }
    });

    const createTagMutation = useMutation({
        mutationFn: tagService.createTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success('Тег успешно создан');
            setFormData({ name: '', description: '' });
        },
        onError: () => {
            toast.error('Ошибка при создании тега');
        }
    });

    const updateTagMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: TagCreate }) =>
            tagService.updateTag(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success('Тег успешно обновлен');
            setEditingTag(null);
            setFormData({ name: '', description: '' });
        },
        onError: () => {
            toast.error('Ошибка при обновлении тега');
        }
    });

    const deleteTagMutation = useMutation({
        mutationFn: tagService.deleteTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            toast.success('Тег успешно удален');
        },
        onError: () => {
            toast.error('Ошибка при удалении тега');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTag) {
            updateTagMutation.mutate({ id: editingTag.id, data: formData });
        } else {
            createTagMutation.mutate(formData);
        }
    };

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag);
        setFormData({ name: tag.name, description: tag.description });
    };

    const handleCancel = () => {
        setEditingTag(null);
        setFormData({ name: '', description: '' });
    };

    if (isLoading) {
        return <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>;
    }

    const tags = tagsResponse?.tags || [];

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Название тега
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Описание
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={3}
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                        {editingTag ? 'Обновить тег' : 'Создать тег'}
                    </button>
                    {editingTag && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Отмена
                        </button>
                    )}
                </div>
            </form>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Существующие теги</h3>
                <div className="grid grid-cols-1 gap-4">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                        >
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{tag.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{tag.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(tag)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    Редактировать
                                </button>
                                <button
                                    onClick={() => deleteTagMutation.mutate(tag.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                    {tags.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">Нет созданных тегов</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TagsManager; 