-- Libelles du recit projet (le defi / mon role / le resultat).
-- Ajoutes au bloc work des deux langues.

update public.translations
set data = jsonb_set(data, '{work,labels}',
      '{"challenge":"Le défi","contribution":"Mon rôle","outcome":"Le résultat"}'::jsonb),
    updated_at = now()
where lang = 'fr';

update public.translations
set data = jsonb_set(data, '{work,labels}',
      '{"challenge":"The challenge","contribution":"My role","outcome":"The outcome"}'::jsonb),
    updated_at = now()
where lang = 'en';
