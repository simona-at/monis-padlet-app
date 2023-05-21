export class Comment {
  constructor(
    public id: number,
    public content: string,
    public user_id: number,
    public created_at: Date
  ) {}
}
