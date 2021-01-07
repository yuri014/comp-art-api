const emailConfirmationMessage = (username: string, recipient: string, url: string) => ({
  from: `${process.env.EMAIL}`,
  to: `${username} <${recipient}>`,
  subject: 'Email de confirmação ✔',
  text: `Olá, ${username}`,
  html: `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta charset="UTF-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta content="telephone=no" name="format-detection" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Jura:wght@300;400&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      <table
        style="font-family: 'Jura', sans-serif;"
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="border-collapse: collapse;"
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
            <td align="center">
              <p>Clique no link abaixo para confirmar a sua conta</p>
            </td>
          </tr>
          <tr>
            <td
              align="center"
              style="padding: 10px 0 10px 0;"
              width="100"
              bgcolor="#1cc5b7"
            >
              <a
                href=${url}
                style="color: #ffffff; text-decoration: none;"
                target="_blank"
                rel="noopener noreferrer"
                >Confirmar email</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>    
  `,
});

export default emailConfirmationMessage;
