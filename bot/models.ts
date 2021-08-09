import {
  Entity,
  Column,
  PrimaryColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity()
export class Image extends BaseEntity {
  @PrimaryColumn()
  url: string;

  @Column()
  authorId: string;

  @Column()
  caption: string;

  @OneToMany(() => Label, (label) => label.id)
  labels: Label[];
}

@Entity()
export class Label extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  confidence: number;

  @ManyToOne(() => Image, (image) => image.url)
  image: Image;
}
