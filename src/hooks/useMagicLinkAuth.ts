import { useState } from 'react';
import { authService } from '../services/authService';
import { ApiError, setAuthToken } from '../services/httpClient';

type Step = 'request' | 'verify' | 'authenticated';

export function useMagicLinkAuth() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(name: string, emailInput: string) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.requestMagicLink(emailInput, name);
      setEmail(emailInput);
      setStep('verify');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo enviar el código. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyCode(code: string) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.validateMagicLink(code);
      setAuthToken(result.token);
      setStep('authenticated');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Código inválido o vencido.');
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setStep('request');
    setEmail('');
    setError(null);
  }

  return { step, email, isLoading, error, requestCode, verifyCode, reset };
}
