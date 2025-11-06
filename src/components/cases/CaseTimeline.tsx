import React, { useState, useEffect } from 'react';
import { getEventsForCase } from '../../services/mockDataService';
import { CaseEvent, CaseEventType } from '../../types';
import Spinner from '../ui/Spinner';
import { ClockIcon, FilePlusIcon, Edit3Icon, BotIcon } from '../ui/Icons';

const EventIcon: React.FC<{ type: CaseEventType }> = ({ type }) => {
    const iconMap = {
        [CaseEventType.FILE_ADDED]: <FilePlusIcon className="w-4 h-4 text-brand-accent" />,
        [CaseEventType.STATUS_CHANGE]: <Edit3Icon className="w-4 h-4 text-yellow-400" />,
        [CaseEventType.AI_ANALYSIS]: <BotIcon className="w-4 h-4 text-purple-400" />,
        [CaseEventType.MESSAGE]: null, // Les messages sont dans le chat, pas affichés ici
    };
    const Icon = iconMap[type];
    return Icon ? <>{Icon}</> : null;
}

const EventItem: React.FC<{ event: CaseEvent }> = ({ event }) => {
    const renderPayload = () => {
        switch(event.type) {
            case CaseEventType.FILE_ADDED:
                return `Fichier ajouté : ${event.payload.fileName}`;
            case CaseEventType.STATUS_CHANGE:
                return `Statut changé : ${event.payload.new}`;
            case CaseEventType.AI_ANALYSIS:
                 return `Analyse IA : ${event.payload.fileName}`;
            default:
                return null;
        }
    }

    const payloadText = renderPayload();
    if (!payloadText) return null;

    return (
        <li className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <EventIcon type={event.type} />
            </div>
            <div className="flex-grow">
                <p className="text-sm text-dark-text">{payloadText}</p>
                <p className="text-xs text-dark-text-secondary">{new Date(event.createdAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
        </li>
    );
};


const CaseTimeline: React.FC<{ caseId: string }> = ({ caseId }) => {
    const [events, setEvents] = useState<CaseEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            const data = await getEventsForCase(caseId);
            setEvents(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            setLoading(false);
        };
        loadEvents();
    }, [caseId]);

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-dark-text flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Timeline des Événements
            </h2>
             {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <Spinner size={32} />
                </div>
            ) : (
                <ul className="space-y-4 overflow-y-auto flex-grow pr-2">
                    {events.map(event => <EventItem key={event.id} event={event} />)}
                </ul>
            )}
        </div>
    );
};

export default CaseTimeline;