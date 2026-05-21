import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { parseMarkdown } from '../utils/markdown';
export const CampaignCard = ({ title, content, icon, color }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (_jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl", children: [_jsx("div", { className: `${color} p-6`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white", children: icon }), _jsx("h3", { className: "text-xl font-bold text-white", children: title })] }), _jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: "text-white hover:bg-white/20 p-2 rounded-lg transition-colors", children: isExpanded ? _jsx(ChevronUp, { size: 20 }) : _jsx(ChevronDown, { size: 20 }) })] }) }), isExpanded && (_jsx("div", { className: "p-6", children: _jsx("div", { className: "prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-ul:text-gray-600", dangerouslySetInnerHTML: { __html: parseMarkdown(content) } }) }))] }));
};
//# sourceMappingURL=CampaignCard.js.map