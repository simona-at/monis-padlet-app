
import { Image } from "./image";
export { Image } from "./image";

import { Like } from "./like";
export { Like } from "./like";

import { Comment } from "./comment";
export { Comment } from "./comment";

import { User } from "./user";
export { User } from "./user";


export class Padlet {
  constructor(
    public id: number,
    public title: string,
    public is_private: boolean,
    public description?: string,
    public images?: Image[],
    public users?: User[],
    public comments?: Comment[],
    public likes?: Like[],
    public created_at?: string,
  ) {
    this.created_at = new Date().toLocaleDateString();
  }


}


