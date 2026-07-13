export const CUSTOM_HTML_EMAIL = (email: formattedEmail) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0eefc;">
          <h2 style="color: #ff6b6b;">🚀 Nuovo Contatto dal Portfolio!</h2>

          <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid black;">
             <p>Hai ricevuto un nuovo messaggio. Ecco i dettagli:</p>

             <!-- Inseriamo la tabella generata di default da Payload -->
             ${email.html}

             <hr style="margin-top: 30px;" />
             <p style="font-size: 12px; color: gray;">
               Email automatica generata da Payload CMS
             </p>
          </div>
        </div>
      `;
