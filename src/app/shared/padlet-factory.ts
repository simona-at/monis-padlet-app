import {Padlet} from "./padlet";

export class PadletFactory {

  static empty() : Padlet{
    return new Padlet(0, '', false, new Date(), '', [{id: 0, url:'',title: ''}], [], [], []);
  }

  static fromObject(rawPadlet:any) : Padlet {
      return new Padlet(
        rawPadlet.id,
        rawPadlet.title,
        rawPadlet.is_private,
        typeof(rawPadlet.created_at) === 'string' ? new Date(rawPadlet.created_at) : rawPadlet.created_at,
        rawPadlet.description,
        rawPadlet.images,
        rawPadlet.users,
        rawPadlet.comments,
        rawPadlet.likes
      );
  }

}
