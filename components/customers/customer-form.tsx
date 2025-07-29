// FILE: components/customers/customer-form.tsx
import { Client } from '@/types/core';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2 } from 'lucide-react';
import { Switch } from '../ui/switch';
import { StatCard } from '../ui/stat-card';

interface CustomerFormProps {
    initialData: Client | null;
}

const CustomerForm = ({ initialData, onCancel }) => {
    const isNew = !initialData;

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isNew ? "Nouveau Client" : "Profil Client"}
                        </h2>
                        {initialData && (
                            <p className="text-sm text-gray-600 mt-1">
                                Solde: <span className={initialData.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {initialData.balance.toLocaleString('fr-FR')} FCFA
                                </span>
                            </p>
                        )}
                    </div>
                    {isNew && (
                        <button
                            onClick={onCancel}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Raison sociale *
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                defaultValue={initialData?.companyName || ''}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Code *
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                defaultValue={initialData?.code || ''}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                defaultValue={initialData?.contactPerson || ''}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                defaultValue={initialData?.phone || ''}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                defaultValue={initialData?.email || ''}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-8 pt-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                defaultChecked={initialData?.isTaxable}
                            />
                            <span className="text-sm text-gray-700">Assujeti à la TVA</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    defaultChecked={initialData?.isActive}
                                />
                                <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                                <div className="absolute w-4 h-4 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                            </div>
                            <span className="text-sm text-gray-700">Client actif</span>
                        </label>
                    </div>
                    
                </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                {!isNew && (
                    <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2">
                        <Trash2 size={16} />
                        <span>Supprimer</span>
                    </button>
                )}
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Save size={16} />
                    <span>{isNew ? "Enregistrer" : "Mettre à jour"}</span>
                </button>
            </div>
        </div>
    );
};

export {CustomerForm}