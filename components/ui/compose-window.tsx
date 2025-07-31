"use client";

import React from 'react';
import { useCompose } from '@/hooks/use-compose-store';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { X, Minus, Expand, Minimize } from 'lucide-react';

export function ComposeWindow() {
    const { 
        isOpen, 
        title, 
        content, 
        isMinimized, 
        isMaximized, 
        onClose, 
        onToggleMinimize, 
        onToggleMaximize 
    } = useCompose();

    if (!isOpen) {
        return null;
    }

    return (
        <div className={cn(
            "fixed bottom-0 z-50 flex flex-col bg-white rounded-t-lg shadow-2xl border border-b-0 transition-all duration-300",
            isMaximized 
                ? "right-0 w-screen h-screen rounded-none" 
                : "right-16 w-[500px]",
            isMinimized ? "h-12" : (isMaximized ? "h-screen" : "h-[70vh]")
        )}>
            <header 
                className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-t-lg cursor-pointer"
                onClick={() => isMinimized && onToggleMinimize()}
            >
                <h3 className="font-semibold text-sm">{title}</h3>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-gray-600" onClick={(e) => { e.stopPropagation(); onToggleMinimize(); }}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-gray-600" onClick={(e) => { e.stopPropagation(); onToggleMaximize(); }}>
                        {isMaximized ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-gray-600" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </header>
            {!isMinimized && (
                <div className="flex-1 overflow-hidden">
                    {content}
                </div>
            )}
        </div>
    );
}