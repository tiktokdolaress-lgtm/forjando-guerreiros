'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      // Permite ao usuário visualizar a landing page se passar o parâmetro ?landing=true
      if (typeof window === 'undefined') return;
      if (window.location.search.includes('landing=true')) return;

      const hasLocal = localStorage.getItem('fg_local_session');
      let hasFg = false;
      const rawFg = localStorage.getItem('forjando_guerreiros_v1');
      if (rawFg) {
        try {
          const parsed = JSON.parse(rawFg);
          if (
            parsed &&
            (parsed.onboarded ||
              (parsed.settings && parsed.settings.pin) ||
              parsed.retStart ||
              parsed.streak)
          ) {
            hasFg = true;
          }
        } catch (e) {}
      }

      let hasSb = false;
      let hasAnyFg = false;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || '';
        if (k.startsWith('sb-') && k.includes('-auth-token')) hasSb = true;
        if (k.startsWith('forjando_guerreiros_v1_')) hasAnyFg = true;
      }

      if (hasLocal || hasSb || hasFg || hasAnyFg) {
        window.location.replace('/app');
      }
    } catch (e) {}
  }, [router]);

  return null;
}
