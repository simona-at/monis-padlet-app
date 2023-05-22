export class ErrorMessage {

  constructor (
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {}

}

export const PadletFormErrorMessages = [
  new ErrorMessage('title', 'required', 'Das Padlet muss einen Titel haben'),
  new ErrorMessage('users', 'required', 'Es muss eine gültige E-Mail-Adresse angegeben werden'),
  new ErrorMessage('email', 'required', 'Es muss eine gültige E-Mail-Adresse angegeben werden'),
  new ErrorMessage('user_role', 'required', 'Es muss eine Benutzerrolle zugewiesen werden')
];
