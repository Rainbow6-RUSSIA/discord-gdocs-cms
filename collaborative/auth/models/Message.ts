/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import type { EmbedLike } from "../../../modules/message/state/models/EmbedModel"
import { Collection } from "./Collection"

@Entity()
export class Message extends BaseEntity {
  constructor(fields?: Partial<Message>) {
    super()
    Object.assign(this, fields)
  }

  @PrimaryGeneratedColumn("increment")
  id!: number

  @Column("character varying", { default: "" })
  content!: string

  @Column("character varying", { default: "" })
  username!: string

  @Column("character varying", { default: "" })
  avatar!: string

  @Column("jsonb")
  embeds!: EmbedLike[]

  @Column("character varying", { default: "" })
  reference!: string

  @Column("timestamp without time zone", { nullable: true })
  timestamp!: Date | null

  @Column("character varying", { nullable: true })
  badge!: string

  @ManyToOne(() => Collection, collection => collection.messages)
  collection!: Collection

  @CreateDateColumn()
  createDate!: Date

  @UpdateDateColumn()
  updateDate!: Date
}
