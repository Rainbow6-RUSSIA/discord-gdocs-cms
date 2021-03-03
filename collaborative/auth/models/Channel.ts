// /* eslint-disable import/no-cycle */
// import {
//     BaseEntity,
//     CreateDateColumn,
//     Entity,
//     OneToMany,
//     PrimaryColumn,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
//   } from "typeorm"
// import { Webhook } from "./Webhook"

//   @Entity()
//   export class Channel extends BaseEntity {
//     constructor(fields?: Partial<Channel>) {
//       super()
//       Object.assign(this, fields)
//     }

//     @PrimaryColumn("character varying")
//     id!: string

//     @OneToMany(() => Webhook, webhook => webhook.channel)
//     webhooks!: Webhook[]

//     @CreateDateColumn()
//     createDate!: Date

//     @UpdateDateColumn()
//     updateDate!: Date
//   }

export {}
