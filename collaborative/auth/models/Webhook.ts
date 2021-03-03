/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity()
export class Webhook extends BaseEntity {
  constructor(fields?: Partial<Webhook>) {
    super()
    Object.assign(this, fields)
  }

  @PrimaryColumn("character varying")
  id!: string

  @Column("character varying")
  token!: string

  // @ManyToOne(() => Channel, channel => channel.webhooks)
  // channel!: Channel

  get url() {
    return `https://discord.com/api/webhooks/${this.id}/${this.token}`
  }
}
