// /* eslint-disable import/no-cycle */
// import {
//   BaseEntity,
//   CreateDateColumn,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm"
// import { Message } from "./Message"

// @Entity()
// export class Collection extends BaseEntity {
//   constructor(fields?: Partial<Collection>) {
//     super()
//     Object.assign(this, fields)
//   }

//   @PrimaryGeneratedColumn("uuid")
//   id!: string

//   @OneToMany(() => Message, message => message.collection)
//   messages!: Message[]

//   @CreateDateColumn()
//   createDate!: Date

//   @UpdateDateColumn()
//   updateDate!: Date
// }

export { }