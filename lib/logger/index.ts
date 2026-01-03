/**
 * Structured Logging System
 *
 * Provides consistent logging across the application.
 * In production, integrates with error tracking services.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogMetadata {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  /**
   * Format log message with metadata
   */
  private formatMessage(level: LogLevel, message: string, meta?: LogMetadata): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
  }

  /**
   * Send logs to external service in production
   */
  private sendToService(level: LogLevel, message: string, meta?: LogMetadata): void {
    if (!this.isProduction) return

    // TODO: Integrate with your logging service
    // Examples:
    // - Sentry: Sentry.captureMessage(message, { level, extra: meta })
    // - Logtail: logtail.log(message, level, meta)
    // - Axiom: axiom.ingest('logs', [{ level, message, ...meta }])

    // For now, still log to console in production for visibility
    const formatted = this.formatMessage(level, message, meta)
    switch (level) {
      case 'error':
        console.error(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      default:
        console.log(formatted)
    }
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, meta?: LogMetadata): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, meta))
    }
  }

  /**
   * Info level logging
   */
  info(message: string, meta?: LogMetadata): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, meta))
    } else {
      this.sendToService('info', message, meta)
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, meta?: LogMetadata): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message, meta))
    } else {
      this.sendToService('warn', message, meta)
    }
  }

  /**
   * Error level logging
   */
  error(message: string, meta?: LogMetadata): void {
    const formatted = this.formatMessage('error', message, meta)

    if (this.isDevelopment) {
      console.error(formatted)
    } else {
      this.sendToService('error', message, meta)
    }
  }

  /**
   * Log API request
   */
  apiRequest(method: string, path: string, meta?: LogMetadata): void {
    this.debug(`${method} ${path}`, meta)
  }

  /**
   * Log API response
   */
  apiResponse(
    method: string,
    path: string,
    statusCode: number,
    duration?: number,
    meta?: LogMetadata
  ): void {
    const durationStr = duration ? ` (${duration}ms)` : ''
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'

    this[level](`${method} ${path} → ${statusCode}${durationStr}`, meta)
  }

  /**
   * Log database operation
   */
  database(operation: string, table: string, meta?: LogMetadata): void {
    this.debug(`DB: ${operation} on ${table}`, meta)
  }

  /**
   * Log rate limit hit
   */
  rateLimitHit(identifier: string, endpoint: string): void {
    this.warn('Rate limit exceeded', {
      identifier,
      endpoint,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Log spam detection
   */
  spamDetected(reason: string, meta?: LogMetadata): void {
    this.warn('Spam submission detected', {
      reason,
      ...meta,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types
export type { LogLevel, LogMetadata }
