import { useCallback, useEffect, useRef, useState } from 'react';
import { Responses } from '../types';
import { autoSaveProgress, generateSessionId, loadSession, SessionLoadData } from '../supabaseClient';
import { sanitizeInput, sanitizeResponses } from '../lib/sanitize';

const isBrowser = typeof window !== 'undefined';

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>(() => {
    if (!isBrowser) {
      return '';
    }

    const existingSession = window.localStorage.getItem('survey_session_id');
    if (existingSession) {
      return existingSession;
    }

    const newSession = generateSessionId();
    window.localStorage.setItem('survey_session_id', newSession);
    return newSession;
  });

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    if (!sessionId) {
      const newSession = generateSessionId();
      window.localStorage.setItem('survey_session_id', newSession);
      setSessionId(newSession);
    }
  }, [sessionId]);

  return sessionId;
}

export function useAutoSave(
  sessionId: string,
  responses: Responses,
  currentSectionId: string,
  progressPercentage: number,
  onSuccess?: () => void,
  onError?: (error: unknown) => void,
  isEnabled: boolean = true
) {
  const responsesRef = useRef(responses);

  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  const runAutoSave = useCallback(async () => {
    if (!sessionId || !isEnabled) {
      return;
    }

    const sanitizedResponses = sanitizeResponses(responsesRef.current);
    const email = sanitizeInput(sanitizedResponses.email || '').trim();

    if (!email) {
      return;
    }

    try {
      const result = await autoSaveProgress(
        sanitizedResponses as Responses,
        sessionId,
        currentSectionId,
        progressPercentage
      );

      if (!result.success) {
        throw result.error ?? new Error('Auto-save failed');
      }

      onSuccess?.();
    } catch (error) {
      onError?.(error);
    }
  }, [sessionId, currentSectionId, progressPercentage, onSuccess, onError, isEnabled]);

  useEffect(() => {
    if (!sessionId || !isEnabled) {
      return;
    }

    runAutoSave();

    const interval = window.setInterval(() => {
      void runAutoSave();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [sessionId, isEnabled, runAutoSave]);
}

export function useLoadSession(
  sessionId: string,
  onSuccess: (result: SessionLoadData) => void,
  onError?: (error: unknown) => void
) {
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    if (!sessionId || hasAttemptedRef.current || !isBrowser) {
      return;
    }

    hasAttemptedRef.current = true;
    let isActive = true;

    const load = async () => {
      try {
        const result = await loadSession(sessionId);

        if (!isActive) {
          return;
        }

        if (!result.success) {
          throw result.error ?? new Error('Failed to load session');
        }

        if (result.data) {
          onSuccess(result.data);
        }
      } catch (error) {
        onError?.(error);
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [sessionId, onSuccess, onError]);
}
