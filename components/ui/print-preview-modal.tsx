"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function PrintPreviewModal({ isOpen, onClose, title, children }: PrintPreviewModalProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Aperçu avant impression : {title}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto border rounded-md p-4 bg-gray-100">
                    <div className="printable-area bg-white shadow-lg p-12 mx-auto" style={{ width: '210mm', minHeight: '210mm' }}>
                        {children}
                    </div>
                </div>
                <DialogFooter className="no-print">
                    <Button type="button" variant="outline" onClick={onClose}>Fermer</Button>
                    <Button type="button" onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/>Imprimer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}