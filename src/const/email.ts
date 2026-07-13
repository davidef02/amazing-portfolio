import type { FormattedEmail } from "@payloadcms/plugin-form-builder/types";

export const CUSTOM_HTML_EMAIL = (email: FormattedEmail): string => `
  <div style="font-family: Arial, sans-serif; background-color: #f0eefc; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff6b6b; margin: 0 0 16px;">🚀 Nuovo Contatto dal Portfolio!</h2>

      <div style="background: #ffffff; padding: 24px; border-radius: 8px; border: 2px solid #000000;">
        <p style="margin: 0 0 16px;">Hai ricevuto un nuovo messaggio. Ecco i dettagli:</p>

        ${email.html}

        <hr style="margin: 30px 0 16px; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="font-size: 12px; color: gray; margin: 0;">
          Email automatica generata da Payload CMS
        </p>
      </div>
    </div>
  </div>
`;
