export class ErrorMessage {

  constructor (
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {}

}

export const PadletFormErrorMessages = [
  new ErrorMessage('title', 'required', 'Das Padlet muss einen Titel haben')
];
