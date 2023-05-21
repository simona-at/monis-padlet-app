import {Pivot} from "./pivot";

export class User {
  constructor(
    public id: number,
    public first_name?: string,
    public last_name?: string,
    public email?: string,
    public user_role?: string,
    public pivot?: Pivot[]
    // public password: string
  ) {}
}
