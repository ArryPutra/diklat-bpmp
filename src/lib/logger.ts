/**
 * Simple Logger untuk tracking aktivitas dan error
 * Di production, bisa diganti dengan layanan logging seperti:
 * - Sentry, LogRocket, Datadog, etc.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: string;
    data?: Record<string, unknown>;
    userId?: string;
    ip?: string;
}

function formatLog(entry: LogEntry): string {
    const parts = [
        `[${entry.timestamp}]`,
        `[${entry.level.toUpperCase()}]`,
        entry.context ? `[${entry.context}]` : '',
        entry.message,
    ].filter(Boolean);

    return parts.join(' ');
}

function createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    data?: Record<string, unknown>
): LogEntry {
    return {
        timestamp: new Date().toISOString(),
        level,
        message,
        context,
        data,
    };
}

// Hanya log di development atau jika LOG_LEVEL diset
const isDev = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDev ? 'debug' : 'error');

const levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

function shouldLog(level: LogLevel): boolean {
    return levels[level] >= levels[logLevel as LogLevel];
}

export const logger = {
    /**
     * Log informasi umum
     */
    info(message: string, context?: string, data?: Record<string, unknown>) {
        if (!shouldLog('info')) return;
        const entry = createLogEntry('info', message, context, data);
        console.log(formatLog(entry), data ? JSON.stringify(data, null, 2) : '');
    },

    /**
     * Log warning
     */
    warn(message: string, context?: string, data?: Record<string, unknown>) {
        if (!shouldLog('warn')) return;
        const entry = createLogEntry('warn', message, context, data);
        console.warn(formatLog(entry), data ? JSON.stringify(data, null, 2) : '');
    },

    /**
     * Log error - SELALU log di production
     */
    error(message: string, context?: string, error?: unknown, data?: Record<string, unknown>) {
        const entry = createLogEntry('error', message, context, data);
        const errorData = error instanceof Error 
            ? { name: error.name, message: error.message, stack: error.stack }
            : { error: String(error) };
        
        console.error(formatLog(entry), JSON.stringify({ ...errorData, ...data }, null, 2));
    },

    /**
     * Log debug - hanya di development
     */
    debug(message: string, context?: string, data?: Record<string, unknown>) {
        if (!shouldLog('debug')) return;
        const entry = createLogEntry('debug', message, context, data);
        console.debug(formatLog(entry), data ? JSON.stringify(data, null, 2) : '');
    },

    /**
     * Log aktivitas user (audit trail)
     */
    audit(action: string, userId?: string, data?: Record<string, unknown>) {
        const entry = createLogEntry('info', `AUDIT: ${action}`, 'audit', { userId, ...data });
        console.log(formatLog(entry), JSON.stringify({ userId, ...data }, null, 2));
    },

    /**
     * Log akses/keamanan
     */
    security(message: string, data?: Record<string, unknown>) {
        const entry = createLogEntry('warn', `SECURITY: ${message}`, 'security', data);
        console.warn(formatLog(entry), JSON.stringify(data, null, 2));
    },
};

export default logger;
