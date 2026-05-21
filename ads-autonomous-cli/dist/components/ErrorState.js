import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AlertCircle } from 'lucide-react';
export const ErrorState = ({ message, onRetry }) => {
    return (_jsxs("div", { className: "bg-red-50 rounded-2xl border border-red-100 p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(AlertCircle, { className: "text-red-500", size: 32 }) }), _jsx("h3", { className: "text-lg font-bold text-red-900 mb-2", children: "Terjadi Kesalahan" }), _jsx("p", { className: "text-red-700 mb-4", children: message }), onRetry && (_jsx("button", { onClick: onRetry, className: "bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors", children: "Coba Lagi" }))] }));
};
//# sourceMappingURL=ErrorState.js.map