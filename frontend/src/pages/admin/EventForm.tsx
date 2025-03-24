import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../../api/services';
import { EventForm as EventFormType } from '../../types';
import toast from 'react-hot-toast';
import { API_URL } from '../../api/config';

const EventForm = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<EventFormType>({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        location: '',
        max_members: 0,
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedExistingImage, setSelectedExistingImage] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Запрос на получение списка загруженных изображений
    const { data: uploadedImages, isLoading: isLoadingImages, error: imagesError } = useQuery({
        queryKey: ['uploadedImages'],
        queryFn: async () => {
            try {
                const images = await eventService.getUploadedImages();
                console.log('Полученные изображения:', images);
                return images;
            } catch (error) {
                console.error('Ошибка при загрузке изображений:', error);
                throw error;
            }
        }
    });

    const createEventMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await eventService.createEvent(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Событие успешно создано');
            resetForm();
        },
        onError: () => {
            toast.error('Ошибка при создании события');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Добавляем все поля формы
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value.toString());
        });

        // Обрабатываем изображение
        if (selectedImage) {
            // Если выбрано новое изображение
            formDataToSend.append('image', selectedImage);
            // Удаляем media_url если он был установлен
            formDataToSend.delete('media_url');
        } else if (selectedExistingImage) {
            // Если выбрано существующее изображение
            formDataToSend.append('media_url', selectedExistingImage);
            // Удаляем image если он был установлен
            formDataToSend.delete('image');
        }

        // Логируем содержимое FormData для отладки
        console.log('Отправляемые данные:');
        for (const [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
        }

        createEventMutation.mutate(formDataToSend);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Выбрано новое изображение:', file);
            setSelectedImage(file);
            setSelectedExistingImage('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExistingImageSelect = (imageUrl: string) => {
        console.log('Выбрано существующее изображение:', imageUrl);
        setSelectedExistingImage(imageUrl);
        setSelectedImage(null);
        // Добавляем API_URL для предпросмотра
        setPreviewUrl(`${API_URL}${imageUrl}`);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            start_time: '',
            end_time: '',
            location: '',
            max_members: 0,
        });
        setSelectedImage(null);
        setSelectedExistingImage('');
        setPreviewUrl(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Название
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Дата и время начала
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Дата и время окончания
                    </label>
                    <input
                        type="datetime-local"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Место проведения
                </label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Максимальное количество участников
                </label>
                <input
                    type="number"
                    value={formData.max_members}
                    onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="1"
                    required
                />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Загрузить новое изображение
                    </label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100
                            dark:file:bg-indigo-900 dark:file:text-indigo-200"
                    />
                </div>

                {isLoadingImages && (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Загрузка изображений...</p>
                    </div>
                )}

                {imagesError && (
                    <div className="text-red-500 dark:text-red-400">
                        Ошибка при загрузке изображений. Пожалуйста, попробуйте позже.
                    </div>
                )}

                {uploadedImages && uploadedImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Или выберите из загруженных изображений
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {uploadedImages.map((imageUrl: string, index: number) => {
                                console.log('Отображение изображения:', imageUrl);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleExistingImageSelect(imageUrl)}
                                        className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedExistingImage === imageUrl
                                            ? 'border-indigo-500'
                                            : 'border-transparent'
                                            }`}
                                    >
                                        <img
                                            src={`${API_URL}${imageUrl}`}
                                            alt={`Uploaded ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {previewUrl && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Предпросмотр выбранного изображения
                        </label>
                        <div className="mt-2">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-32 w-auto object-cover rounded-lg"
                                onError={(e) => {
                                    console.error('Ошибка загрузки предпросмотра:', previewUrl);
                                    const imgElement = e.currentTarget;
                                    if (!imgElement.src.startsWith('http')) {
                                        imgElement.src = `${API_URL}${previewUrl}`;
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={createEventMutation.isPending}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-gray-600"
                >
                    {createEventMutation.isPending ? 'Создание...' : 'Создать событие'}
                </button>
            </div>
        </form>
    );
};

export default EventForm; 