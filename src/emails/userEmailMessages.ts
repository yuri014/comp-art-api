// eslint-disable-next-line import/prefer-default-export
export const passwordRecoverMessage = (username: string, recipient: string, url: string) => ({
  from: `${process.env.EMAIL}`,
  to: `${username} <${recipient}>`,
  subject: 'Email de confirmação ✔',
  text: `Olá, ${username}`,
  html: `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Demystifying Email Design</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body>
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="font-family: sans-serif; border-collapse: collapse;"
      >
        <thead>
          <tr>
            <th align="center" bgcolor="#08162f" style="padding: 30px 0 30px 0;">
              <h1 style="color: #1cc5b7;">COMP-ART</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td bgcolor="#cbcaeb" style="padding: 10px 30px;">
              <h2 style="color: #08162f;">Olá, ${username}</h2>
              <p style="color: #08162f;">Agradecemos por você se juntar a nossa plataforma!</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 10px;">
              <p>Clique no link abaixo para confirmar a sua conta</p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <a
                href=${url}
                style="color: #ffffff; text-decoration: none; padding: 10px 40px; background-color: #1cc5b7"
                width="100"
                target="_blank"
                rel="noopener noreferrer"
                >
                Confirmar email
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>    
  `,
});
