import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
export const CampaignHistory = ({ onViewCampaign, onDeleteCampaign, refreshTrigger }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const loadCampaigns = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.listCampaigns();
            if (response.data?.campaigns) {
                setCampaigns(response.data.campaigns);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load campaigns');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadCampaigns();
    }, [refreshTrigger]);
    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus campaign ini?')) {
            try {
                await api.deleteCampaign(id);
                setCampaigns(campaigns.filter(c => c.id !== id));
                onDeleteCampaign(id);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete campaign');
            }
        }
    };
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };
    if (isLoading) {
        return (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map(i => (_jsx("div", { className: "h-20 bg-gray-100 rounded-lg animate-pulse" }, i))) }));
    }
    if (campaigns.length === 0) {
        return (_jsx("div", { className: "text-center py-8 text-gray-500", children: _jsx("p", { children: "Belum ada campaign history" }) }));
    }
    return (_jsxs("div", { className: "space-y-3", children: [error && (_jsx("div", { className: "bg-red-50 text-red-700 p-3 rounded-lg text-sm", children: error })), campaigns.map(campaign => (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow", children: _jsxs("div", { className: "p-4", children: [_jsx("div", { className: "flex items-start justify-between mb-3", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-bold text-gray-900", children: campaign.keyword }), _jsx("span", { className: `px-2 py-0.5 rounded text-xs font-semibold ${campaign.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'}`, children: campaign.status === 'completed' ? '✓ Berhasil' : '✗ Gagal' })] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: campaign.productDescription }), _jsxs("div", { className: "flex gap-4 mt-2 text-xs text-gray-500", children: [_jsx("span", { children: new Date(campaign.timestamp).toLocaleDateString('id-ID') }), campaign.duration && _jsxs("span", { children: [Math.round(campaign.duration / 1000), "s"] })] })] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => onViewCampaign(campaign.id), className: "flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors", children: [_jsx(Eye, { size: 16 }), "Lihat Detail"] }), _jsx("button", { onClick: () => setExpandedId(expandedId === campaign.id ? null : campaign.id), className: "flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors", children: expandedId === campaign.id ? (_jsx(ChevronUp, { size: 16 })) : (_jsx(ChevronDown, { size: 16 })) }), _jsx("button", { onClick: () => handleDelete(campaign.id), className: "flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm transition-colors", children: _jsx(Trash2, { size: 16 }) })] }), expandedId === campaign.id && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "ID Campaign" }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx("code", { className: "text-xs bg-gray-100 px-2 py-1 rounded flex-1 font-mono", children: campaign.id }), _jsx("button", { onClick: () => handleCopy(campaign.id), className: "bg-gray-100 hover:bg-gray-200 p-1.5 rounded text-gray-700 transition-colors", children: _jsx(Copy, { size: 14 }) })] })] }), campaign.error && (_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Error" }), _jsx("p", { className: "text-red-600 mt-1 bg-red-50 p-2 rounded", children: campaign.error })] }))] }) }))] }) }, campaign.id)))] }));
};
//# sourceMappingURL=CampaignHistory.js.map