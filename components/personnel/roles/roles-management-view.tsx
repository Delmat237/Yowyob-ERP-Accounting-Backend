"use client";

import React, { useState, useCallback } from 'react';
import { Profile } from '@/types/personnel';
import { Warehouse } from '@/types/stock';
import { createProfile, updateProfile, deleteProfile, getProfiles } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProfileForm } from './profile-form';

interface RolesManagementViewProps {
    initialProfiles: Profile[];
    warehouses: Warehouse[];
}

const emptyProfile: Omit<Profile, 'id'> = {
    name: '',
    description: '',
    permissions: {},
    authorizedPrices: [],
    authorizedWarehouses: [],
    authorizedPaymentModes: [],
    authorizedDiscounts: [],
};

export function RolesManagementView({ initialProfiles, warehouses }: RolesManagementViewProps) {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(initialProfiles[0] || null);
    const [isCreating, setIsCreating] = useState(false);

    const refreshProfiles = useCallback(async () => {
        const data = await getProfiles();
        setProfiles(data);
    }, []);

    const handleSelectProfile = (profile: Profile) => {
        setSelectedProfile(profile);
        setIsCreating(false);
    };

    const handleAddNew = () => {
        setSelectedProfile(null);
        setIsCreating(true);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setSelectedProfile(profiles[0] || null);
    };

    const handleSaveProfile = async (data: Profile) => {
        try {
            if (isCreating) {
                await createProfile(data);
            } else {
                await updateProfile(data.id, data);
            }
            await refreshProfiles();
            alert("Profil enregistré avec succès.");
            setIsCreating(false);
        } catch (error) {
            console.error("Failed to save profile", error);
        }
    };

    const handleDeleteProfile = async (id: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.")) return;
        try {
            await deleteProfile(id);
            await refreshProfiles();
            setSelectedProfile(null);
            alert("Profil supprimé.");
        } catch (error) {
            console.error("Failed to delete profile", error);
        }
    };

    return (
        <div className="h-full flex gap-4">
            <Card className="w-1/3 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className='text-base'>Liste des profils</CardTitle>
                    <Button size="sm" onClick={handleAddNew}><Plus className="mr-2 h-4 w-4"/>Nouveau</Button>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-2">
                     <div className="space-y-1">
                        {profiles.map(profile => (
                            <div key={profile.id} onClick={() => handleSelectProfile(profile)} className={`p-2 rounded-md cursor-pointer ${selectedProfile?.id === profile.id ? 'bg-primary/10' : 'hover:bg-accent'}`}>
                                <p className="font-semibold">{profile.name}</p>
                                <p className="text-sm text-muted-foreground">{profile.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="w-2/3">
                {selectedProfile || isCreating ? (
                    <ProfileForm
                        key={selectedProfile?.id || 'new'}
                        initialData={isCreating ? emptyProfile : selectedProfile}
                        isCreating={isCreating}
                        warehouses={warehouses}
                        onSave={handleSaveProfile}
                        onDelete={handleDeleteProfile}
                        onCancel={handleCancel}
                    />
                ) : (
                     <Card className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Sélectionnez un profil pour le modifier ou en créer un nouveau.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}