// import { randomBytes } from "crypto"
// import {
//   BaseEntity,
//   Column,
//   CreateDateColumn,
//   Entity,
//   PrimaryGeneratedColumn,
//   Unique,
//   UpdateDateColumn,
// } from "typeorm"

// @Entity()
// @Unique(["accessToken", "sessionToken"])
// export class Session extends BaseEntity {
//   constructor(fields?: Pick<Session, "userId" | "expires"> & Partial<Session>) {
//     super()
//     Object.assign(this, fields)
//     this.sessionToken = fields?.sessionToken ?? randomBytes(32).toString("hex")
//     this.accessToken = fields?.accessToken ?? randomBytes(32).toString("hex")
//   }

//   @PrimaryGeneratedColumn("uuid")
//   id!: string

//   @Column("uuid")
//   userId!: string

//   @Column("timestamp without time zone")
//   expires!: Date

//   @Column("character varying")
//   sessionToken: string

//   @Column("character varying")
//   accessToken: string

//   @CreateDateColumn()
//   createDate!: Date

//   @UpdateDateColumn()
//   updateDate!: Date
// }

export { }