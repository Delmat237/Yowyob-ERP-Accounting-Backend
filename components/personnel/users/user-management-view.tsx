"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { User, Profile } from '@/types/personnel';
import { Warehouse } from '@/types/stock';
import { updateUser, getUsers, createUser } from '@/lib/api';
import { UserForm } from './user-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewUserDialog } from './new-user-dialog';

interface UserManagementViewProps {
    initialUsers: User[];
    profiles: Profile[];
    warehouses: Warehouse[];
}

export function UserManagementView({ initialUsers, profiles, warehouses }: UserManagementViewProps) {
    const [users, setUsers] = useState(initialUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(initialUsers[0] || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);

    const refreshUsers = useCallback(async () => {
        const data = await getUsers();
        setUsers(data);
    }, []);

    const filteredUsers = useMemo(() => 
        users.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.code.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);
    
    const handleSaveUser = async (data: Partial<User>) => {
        if (!selectedUser) return;
        try {
            const updatedUser = await updateUser(selectedUser.id, data);
            await refreshUsers();
            setSelectedUser(updatedUser);
            alert("Utilisateur mis à jour.");
        } catch (error) {
            console.error("Failed to update user", error);
        }
    };
    
    const handleCreateUser = async (data: Omit<User, 'id' | 'creationDate'>) => {
        try {
            const newUser = await createUser(data);
            await refreshUsers();
            setSelectedUser(newUser);
            setIsNewUserDialogOpen(false);
            alert("Nouvel utilisateur créé avec succès.");
        } catch (error) {
            console.error("Failed to create user", error);
        }
    };

    return (
        <div className="h-full flex gap-4">
            <Card className="w-1/3 flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className='text-base'>Liste des utilisateurs</CardTitle>
                        <Button size="sm" onClick={() => setIsNewUserDialogOpen(true)}><Plus className="mr-2 h-4 w-4"/>Nouveau</Button>
                    </div>
                    <div className="relative mt-2">
                        <Input placeholder="Filtrer la liste..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-2">
                    <div className="space-y-1">
                        {filteredUsers.map(user => (
                            <div key={user.id} onClick={() => setSelectedUser(user)} className={`p-2 rounded-md cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary/10' : 'hover:bg-accent'}`}>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.code}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="w-2/3">
                {selectedUser ? (
                    <UserForm 
                        key={selectedUser.id}
                        user={selectedUser}
                        profiles={profiles}
                        warehouses={warehouses}
                        onSave={handleSaveUser}
                    />
                ) : (
                    <Card className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Sélectionnez un utilisateur pour voir les détails ou créez-en un nouveau.</p>
                    </Card>
                )}
            </div>

            <NewUserDialog
                isOpen={isNewUserDialogOpen}
                onClose={() => setIsNewUserDialogOpen(false)}
                profiles={profiles}
                onSubmit={handleCreateUser}
            />
        </div>
    );
}