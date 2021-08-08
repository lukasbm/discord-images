import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Image {
  @PrimaryColumn()
  url: string;

  @Column()
  authorId: string;

  @Column()
  caption: string;

  @Column()
  channel: string;

}
